import { drizzle } from "drizzle-orm/d1";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import app from "../src/index";
import * as schema from "../src/db/schema";
import type { Db } from "../src/db/queries";
import { perbaruiJadwal, simpanJadwal } from "../src/lib/jadwal-konsultasi";
import { periksaJadwal, validasiJadwal } from "../src/lib/validasi";
import { buatDbUji, buatSesiUji, envUji } from "./harness";
import { json, minta } from "./util";

/**
 * UC-05 — Mengelola Jadwal Konsultan (admin side of I-12).
 * Algo-025 `validasiJadwal`, `JadwalKonsultasi.simpanJadwal` / `perbaruiJadwal`,
 * and the routes that connect them (Algo-022 administrator branch, Algo-029 Q-027).
 */

const KUNCI = "k1";
// The seed writes `...:00Z`; the API writes `...:00.000Z`. Both formats must coexist.
const J1 = { id: "j1", mulai: "2031-06-01T03:00:00Z", selesai: "2031-06-01T04:00:00Z" };
const J2 = { id: "j2", mulai: "2031-06-01T05:00:00Z", selesai: "2031-06-01T06:00:00Z" };

function seed(ctx: ReturnType<typeof buatDbUji>) {
  ctx.raw.exec(`
    INSERT INTO konsultan (id_konsultan, nama, spesialisasi) VALUES
      ('k1', 'Dr. Raisa', 'Psikologi Klinis'),
      ('k2', 'Bagas, M.Pd.', 'Konseling');
    INSERT INTO jadwal_konsultasi (id_jadwal, id_konsultan, waktu, waktu_selesai, status) VALUES
      ('${J1.id}', 'k1', '${J1.mulai}', '${J1.selesai}', 'tersedia'),
      ('${J2.id}', 'k1', '${J2.mulai}', '${J2.selesai}', 'tersedia');
  `);
}

const barisJadwal = (ctx: ReturnType<typeof buatDbUji>, id: string) =>
  ctx.raw
    .prepare("SELECT waktu, waktu_selesai, status, id_mahasiswa FROM jadwal_konsultasi WHERE id_jadwal = ?")
    .get(id) as { waktu: string; waktu_selesai: string; status: string; id_mahasiswa: string | null } | undefined;

const jumlahJadwal = (ctx: ReturnType<typeof buatDbUji>) =>
  (ctx.raw.prepare("SELECT COUNT(*) AS n FROM jadwal_konsultasi").get() as { n: number }).n;

/** A D1 binding that throws for statements matching `pola`, to simulate a failing database. */
function d1Gagal(D1: D1Database, pola: RegExp): D1Database {
  return {
    ...D1,
    prepare: (sql: string) => {
      if (pola.test(sql)) throw new Error("D1 tidak tersedia");
      return D1.prepare(sql);
    },
  } as unknown as D1Database;
}

/* -------------------------------------------------------------------------- */
/* Algo-025 validasiJadwal                                                    */
/* -------------------------------------------------------------------------- */

describe("Validasi.validasiJadwal (Algo-025)", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let db: Db;

  beforeEach(() => {
    ctx = buatDbUji();
    seed(ctx);
    db = drizzle(ctx.D1, { schema }) as unknown as Db;
  });
  afterEach(() => ctx.tutup());

  const slot = (mulai: unknown, selesai: unknown, ekstra: Record<string, unknown> = {}) => ({
    idKonsultan: KUNCI,
    waktu: mulai,
    waktuSelesai: selesai,
    ...ekstra,
  });

  test("menerima slot yang rapi dan mengembalikan batas waktunya", async () => {
    const hasil = await periksaJadwal(db, slot("2031-06-01T07:00:00.000Z", "2031-06-01T08:00:00.000Z"));
    expect(hasil.valid).toBe(true);
    if (hasil.valid) {
      expect(hasil.mulai.toISOString()).toBe("2031-06-01T07:00:00.000Z");
      expect(hasil.selesai.toISOString()).toBe("2031-06-01T08:00:00.000Z");
    }
    await expect(validasiJadwal(db, slot("2031-06-01T07:00:00Z", "2031-06-01T08:00:00Z"))).resolves.toBe(true);
  });

  test.each([
    ["teks bukan waktu", "besok pagi", "2031-06-01T08:00:00Z"],
    ["tanggal tanpa jam", "2031-06-01", "2031-06-02"],
    ["string kosong", "", "2031-06-01T08:00:00Z"],
    ["bukan string", 1780282800000, "2031-06-01T08:00:00Z"],
    ["null", null, null],
    ["selesai tidak valid", "2031-06-01T07:00:00Z", "tidak-valid"],
  ])("menolak waktu yang bukan ISO 8601 (%s)", async (_nama, mulai, selesai) => {
    const hasil = await periksaJadwal(db, slot(mulai, selesai));
    expect(hasil).toMatchObject({ valid: false, alasan: "FORMAT_WAKTU" });
    await expect(validasiJadwal(db, slot(mulai, selesai))).resolves.toBe(false);
  });

  test("menolak waktu selesai yang sama dengan waktu mulai", async () => {
    const hasil = await periksaJadwal(db, slot("2031-06-01T07:00:00Z", "2031-06-01T07:00:00Z"));
    expect(hasil).toMatchObject({ valid: false, alasan: "URUTAN_WAKTU" });
  });

  test("menolak waktu selesai sebelum waktu mulai", async () => {
    const hasil = await periksaJadwal(db, slot("2031-06-01T08:00:00Z", "2031-06-01T07:00:00Z"));
    expect(hasil).toMatchObject({ valid: false, alasan: "URUTAN_WAKTU" });
  });

  test("membandingkan sebagai waktu, bukan sebagai teks", async () => {
    // 14:00+07:00 is 07:00Z: the same instant, so the window is empty.
    const kosong = await periksaJadwal(db, slot("2031-06-01T14:00:00+07:00", "2031-06-01T07:00:00Z"));
    expect(kosong).toMatchObject({ valid: false, alasan: "URUTAN_WAKTU" });
    // 09:00+07:00 is 02:00Z, one hour BEFORE 03:00Z. As text "09:00" > "03:00" would look reversed.
    const sah = await periksaJadwal(db, slot("2031-06-01T09:00:00+07:00", "2031-06-01T03:00:00Z"));
    expect(sah.valid).toBe(true);
    if (sah.valid) expect(sah.mulai.toISOString()).toBe("2031-06-01T02:00:00.000Z");
  });

  test("menolak konsultan yang tidak terdaftar (Q-019)", async () => {
    const hasil = await periksaJadwal(db, slot("2031-06-01T07:00:00Z", "2031-06-01T08:00:00Z", { idKonsultan: "k9" }));
    expect(hasil).toMatchObject({ valid: false, alasan: "KONSULTAN_TIDAK_TERDAFTAR" });
  });

  test.each([[undefined], [""], ["   "], [42]])("menolak idKonsultan %j", async (idKonsultan) => {
    const hasil = await periksaJadwal(db, slot("2031-06-01T07:00:00Z", "2031-06-01T08:00:00Z", { idKonsultan }));
    expect(hasil).toMatchObject({ valid: false, alasan: "KONSULTAN_TIDAK_TERDAFTAR" });
  });

  describe("tumpang tindih dengan slot konsultan yang sama (Q-020)", () => {
    test.each([
      ["sebagian dari depan", "2031-06-01T02:30:00Z", "2031-06-01T03:30:00Z"],
      ["sebagian dari belakang", "2031-06-01T03:30:00Z", "2031-06-01T04:30:00Z"],
      ["membungkus slot lain", "2031-06-01T02:00:00Z", "2031-06-01T05:00:00Z"],
      ["berada di dalam slot lain", "2031-06-01T03:15:00Z", "2031-06-01T03:45:00Z"],
      ["persis sama", J1.mulai, J1.selesai],
      ["menjembatani dua slot", "2031-06-01T03:30:00Z", "2031-06-01T05:30:00Z"],
    ])("menolak slot yang %s", async (_nama, mulai, selesai) => {
      const hasil = await periksaJadwal(db, slot(mulai, selesai));
      expect(hasil).toMatchObject({ valid: false, alasan: "TUMPANG_TINDIH" });
    });

    test("slot yang menempel (selesai = mulai berikutnya) tidak dianggap tumpang tindih", async () => {
      // J1 is stored without milliseconds; the candidates below are canonical (`.000Z`).
      const sesudah = await periksaJadwal(db, slot("2031-06-01T04:00:00.000Z", "2031-06-01T05:00:00.000Z"));
      expect(sesudah.valid).toBe(true);
      const sebelum = await periksaJadwal(db, slot("2031-06-01T02:00:00.000Z", "2031-06-01T03:00:00.000Z"));
      expect(sebelum.valid).toBe(true);
    });

    test("konsultan lain boleh memakai jam yang sama", async () => {
      const hasil = await periksaJadwal(db, slot(J1.mulai, J1.selesai, { idKonsultan: "k2" }));
      expect(hasil.valid).toBe(true);
    });

    test("saat mengedit, slot itu sendiri tidak dihitung sebagai bentrok", async () => {
      const geser = await periksaJadwal(db, slot("2031-06-01T03:30:00Z", "2031-06-01T04:30:00Z", { idJadwal: J1.id }));
      expect(geser.valid).toBe(true);
      const sama = await periksaJadwal(db, slot(J1.mulai, J1.selesai, { idJadwal: J1.id }));
      expect(sama.valid).toBe(true);
    });

    test("saat mengedit, slot LAIN milik konsultan tetap menghalangi", async () => {
      const hasil = await periksaJadwal(db, slot("2031-06-01T04:30:00Z", "2031-06-01T05:30:00Z", { idJadwal: J1.id }));
      expect(hasil).toMatchObject({ valid: false, alasan: "TUMPANG_TINDIH" });
    });

    test("slot yang sudah dipesan ikut dihitung", async () => {
      buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
      ctx.raw.exec(`UPDATE jadwal_konsultasi SET status = 'terpesan', id_mahasiswa = 'mhs' WHERE id_jadwal = 'j1'`);
      const hasil = await periksaJadwal(db, slot("2031-06-01T03:30:00Z", "2031-06-01T04:30:00Z"));
      expect(hasil).toMatchObject({ valid: false, alasan: "TUMPANG_TINDIH" });
    });
  });

  test("masukan yang cacat ditolak sebelum menyentuh database", async () => {
    const dbRusak = new Proxy({}, { get: () => { throw new Error("database tidak boleh dipakai"); } }) as unknown as Db;
    await expect(periksaJadwal(dbRusak, slot("bukan waktu", "2031-06-01T08:00:00Z"))).resolves.toMatchObject({
      alasan: "FORMAT_WAKTU",
    });
    await expect(periksaJadwal(dbRusak, slot("2031-06-01T08:00:00Z", "2031-06-01T08:00:00Z"))).resolves.toMatchObject({
      alasan: "URUTAN_WAKTU",
    });
  });
});

/* -------------------------------------------------------------------------- */
/* JadwalKonsultasi.simpanJadwal / perbaruiJadwal                             */
/* -------------------------------------------------------------------------- */

describe("JadwalKonsultasi.simpanJadwal / perbaruiJadwal", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let db: Db;

  beforeEach(() => {
    ctx = buatDbUji();
    seed(ctx);
    db = drizzle(ctx.D1, { schema }) as unknown as Db;
  });
  afterEach(() => ctx.tutup());

  test("simpanJadwal menyimpan slot baru berstatus tersedia dan mengembalikan id-nya", async () => {
    const id = await simpanJadwal(db, {
      idKonsultan: "k1",
      waktu: "2031-06-01T07:00:00.000Z",
      waktuSelesai: "2031-06-01T08:00:00.000Z",
    });
    expect(id).toEqual(expect.any(String));
    expect(barisJadwal(ctx, id!)).toEqual({
      waktu: "2031-06-01T07:00:00.000Z",
      waktu_selesai: "2031-06-01T08:00:00.000Z",
      status: "tersedia",
      id_mahasiswa: null,
    });
  });

  test("simpanJadwal menolak slot yang tumpang tindih meski validasi dilewati (balapan dua admin)", async () => {
    const sebelum = jumlahJadwal(ctx);
    const id = await simpanJadwal(db, {
      idKonsultan: "k1",
      waktu: "2031-06-01T03:30:00.000Z",
      waktuSelesai: "2031-06-01T04:30:00.000Z",
    });
    expect(id).toBeNull();
    expect(jumlahJadwal(ctx)).toBe(sebelum);
  });

  test("simpanJadwal menerima slot yang menempel pada slot berformat lama", async () => {
    const id = await simpanJadwal(db, {
      idKonsultan: "k1",
      waktu: "2031-06-01T04:00:00.000Z",
      waktuSelesai: "2031-06-01T05:00:00.000Z",
    });
    expect(id).not.toBeNull();
  });

  test("perbaruiJadwal mengubah waktu mulai dan selesai (Q-027) dan hanya itu", async () => {
    const ok = await perbaruiJadwal(db, {
      idJadwal: J1.id,
      waktu: "2031-06-01T03:30:00.000Z",
      waktuSelesai: "2031-06-01T04:30:00.000Z",
    });
    expect(ok).toBe(true);
    expect(barisJadwal(ctx, J1.id)).toEqual({
      waktu: "2031-06-01T03:30:00.000Z",
      waktu_selesai: "2031-06-01T04:30:00.000Z",
      status: "tersedia",
      id_mahasiswa: null,
    });
  });

  test("perbaruiJadwal menolak jendela yang menabrak slot lain dan tidak mengubah apa pun", async () => {
    const ok = await perbaruiJadwal(db, {
      idJadwal: J1.id,
      waktu: "2031-06-01T04:30:00.000Z",
      waktuSelesai: "2031-06-01T05:30:00.000Z",
    });
    expect(ok).toBe(false);
    expect(barisJadwal(ctx, J1.id)).toMatchObject({ waktu: J1.mulai, waktu_selesai: J1.selesai });
  });

  test("perbaruiJadwal mengembalikan false untuk slot yang tidak ada", async () => {
    const ok = await perbaruiJadwal(db, {
      idJadwal: "tidak-ada",
      waktu: "2031-06-01T10:00:00.000Z",
      waktuSelesai: "2031-06-01T11:00:00.000Z",
    });
    expect(ok).toBe(false);
  });

  test("perbaruiJadwal tidak mengubah status atau pemesan slot yang sudah dipesan", async () => {
    buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
    ctx.raw.exec(`UPDATE jadwal_konsultasi SET status = 'terpesan', id_mahasiswa = 'mhs' WHERE id_jadwal = 'j1'`);
    const ok = await perbaruiJadwal(db, {
      idJadwal: J1.id,
      waktu: "2031-06-01T03:30:00.000Z",
      waktuSelesai: "2031-06-01T04:30:00.000Z",
    });
    expect(ok).toBe(true);
    expect(barisJadwal(ctx, J1.id)).toMatchObject({ status: "terpesan", id_mahasiswa: "mhs" });
  });
});

/* -------------------------------------------------------------------------- */
/* Rute: UC-05 skenario normal dan alternatif                                 */
/* -------------------------------------------------------------------------- */

describe("UC-05 — rute jadwal konsultan untuk administrator", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let admin: string;
  let mhs: string;

  beforeEach(() => {
    ctx = buatDbUji();
    seed(ctx);
    admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    ctx.tutup();
  });

  const buat = (body: unknown, token = admin, D1 = ctx.D1) =>
    minta(app, D1, { method: "POST", path: "/api/slots", token, body });
  const ubah = (id: string, body: unknown, token = admin, D1 = ctx.D1) =>
    minta(app, D1, { method: "PATCH", path: `/api/slots/${id}`, token, body });

  describe("GET /api/consultants/:id/slots (data I-12)", () => {
    test("administrator melihat slot tersedia DAN terpesan", async () => {
      ctx.raw.exec(`UPDATE jadwal_konsultasi SET status = 'terpesan', id_mahasiswa = 'mhs' WHERE id_jadwal = 'j2'`);
      const body = await json(await minta(app, ctx.D1, { path: "/api/consultants/k1/slots", token: admin }));
      expect(body.slots.map((s: any) => [s.idJadwal, s.status])).toEqual([
        ["j1", "tersedia"],
        ["j2", "terpesan"],
      ]);
    });

    test("mahasiswa tetap hanya melihat slot tersedia", async () => {
      ctx.raw.exec(`UPDATE jadwal_konsultasi SET status = 'terpesan', id_mahasiswa = 'mhs' WHERE id_jadwal = 'j2'`);
      buatSesiUji(ctx.raw, { idPengguna: "mhs2", peran: "mahasiswa", token: "tm2" });
      const body = await json(await minta(app, ctx.D1, { path: "/api/consultants/k1/slots", token: "tm2" }));
      expect(body.slots.map((s: any) => s.idJadwal)).toEqual(["j1"]);
    });

    test("daftar administrator mulai dari awal hari ini (WIB), bukan dari sekarang", async () => {
      const WIB_MS = 7 * 3_600_000;
      const HARI_MS = 86_400_000;
      const awalHariWib = Math.floor((Date.now() + WIB_MS) / HARI_MS) * HARI_MS - WIB_MS;
      const mulai = new Date(awalHariWib + 60_000); // 00:01 WIB today
      const selesai = new Date(awalHariWib + 3_600_000);
      ctx.raw
        .prepare("INSERT INTO jadwal_konsultasi (id_jadwal, id_konsultan, waktu, waktu_selesai, status) VALUES (?,?,?,?, 'tersedia')")
        .run("hari-ini", "k2", mulai.toISOString(), selesai.toISOString());
      const sebelumAwal = new Date(awalHariWib - 3_600_000);
      ctx.raw
        .prepare("INSERT INTO jadwal_konsultasi (id_jadwal, id_konsultan, waktu, waktu_selesai, status) VALUES (?,?,?,?, 'tersedia')")
        .run("kemarin", "k2", sebelumAwal.toISOString(), new Date(awalHariWib - 60_000).toISOString());
      const body = await json(await minta(app, ctx.D1, { path: "/api/consultants/k2/slots", token: admin }));
      const ids = body.slots.map((s: any) => s.idJadwal);
      expect(ids).toContain("hari-ini");
      expect(ids).not.toContain("kemarin");
    });

    test("404 untuk konsultan tak dikenal", async () => {
      const res = await minta(app, ctx.D1, { path: "/api/consultants/k9/slots", token: admin });
      expect(res.status).toBe(404);
    });

    test("alternatif 1: kegagalan database mengembalikan galat server (layar menampilkan I-12-08)", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      const D1 = d1Gagal(ctx.D1, /FROM "jadwal_konsultasi"|FROM jadwal_konsultasi/i);
      const res = await minta(app, D1, { path: "/api/consultants/k1/slots", token: admin });
      expect(res.status).toBe(500);
      expect((await json(res)).error.kode).toBe("KESALAHAN_SERVER");
    });
  });

  describe("POST /api/slots — simpanJadwal", () => {
    test("menambah slot dan slot itu muncul pada daftar administrator", async () => {
      const res = await buat({ idKonsultan: "k1", waktu: "2031-06-01T07:00:00Z", waktuSelesai: "2031-06-01T08:00:00Z" });
      expect(res.status).toBe(201);
      const { ok, idJadwal } = await json(res);
      expect(ok).toBe(true);
      expect(barisJadwal(ctx, idJadwal)).toMatchObject({ status: "tersedia", id_mahasiswa: null });

      const daftar = await json(await minta(app, ctx.D1, { path: "/api/consultants/k1/slots", token: admin }));
      expect(daftar.slots.map((s: any) => s.idJadwal)).toContain(idJadwal);
    });

    test("422 bila waktu selesai sama dengan waktu mulai, dan tidak ada yang tersimpan", async () => {
      const sebelum = jumlahJadwal(ctx);
      const res = await buat({ idKonsultan: "k1", waktu: "2031-06-01T07:00:00Z", waktuSelesai: "2031-06-01T07:00:00Z" });
      expect(res.status).toBe(422);
      const galat = (await json(res)).error;
      expect(galat.kode).toBe("VALIDASI_GAGAL");
      expect(galat.pesan).toMatch(/setelah/i);
      expect(jumlahJadwal(ctx)).toBe(sebelum);
    });

    test("422 bila waktu selesai sebelum waktu mulai", async () => {
      const res = await buat({ idKonsultan: "k1", waktu: "2031-06-01T08:00:00Z", waktuSelesai: "2031-06-01T07:00:00Z" });
      expect(res.status).toBe(422);
    });

    test.each([
      ["waktu bukan ISO", { waktu: "pagi", waktuSelesai: "2031-06-01T08:00:00Z" }],
      ["waktu tidak ada", { waktuSelesai: "2031-06-01T08:00:00Z" }],
      ["tanggal tanpa jam", { waktu: "2031-06-01", waktuSelesai: "2031-06-02" }],
    ])("422 untuk %s", async (_nama, waktu) => {
      const res = await buat({ idKonsultan: "k1", ...waktu });
      expect(res.status).toBe(422);
    });

    test("422 tanpa idKonsultan", async () => {
      const res = await buat({ waktu: "2031-06-01T07:00:00Z", waktuSelesai: "2031-06-01T08:00:00Z" });
      expect(res.status).toBe(422);
    });

    test("409 JADWAL_BENTROK untuk slot yang tumpang tindih, dan tidak ada yang tersimpan", async () => {
      const sebelum = jumlahJadwal(ctx);
      const res = await buat({ idKonsultan: "k1", waktu: "2031-06-01T03:30:00Z", waktuSelesai: "2031-06-01T04:30:00Z" });
      expect(res.status).toBe(409);
      expect((await json(res)).error.kode).toBe("JADWAL_BENTROK");
      expect(jumlahJadwal(ctx)).toBe(sebelum);
    });

    test("slot yang menempel pada slot lama diterima (201)", async () => {
      const res = await buat({ idKonsultan: "k1", waktu: "2031-06-01T04:00:00Z", waktuSelesai: "2031-06-01T05:00:00Z" });
      expect(res.status).toBe(201);
    });

    test("dua administrator menyimpan slot yang bertumpang tindih bersamaan: hanya satu yang tersimpan", async () => {
      const sebelum = jumlahJadwal(ctx);
      const hasil = await Promise.all([
        buat({ idKonsultan: "k2", waktu: "2031-06-03T01:00:00Z", waktuSelesai: "2031-06-03T02:00:00Z" }),
        buat({ idKonsultan: "k2", waktu: "2031-06-03T01:30:00Z", waktuSelesai: "2031-06-03T02:30:00Z" }),
      ]);
      expect(hasil.map((r) => r.status).sort()).toEqual([201, 409]);
      expect(jumlahJadwal(ctx)).toBe(sebelum + 1);
    });

    test("alternatif 2: database gagal menyimpan -> 500 dengan pesan I-12-07, tanpa data setengah jadi", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      const sebelum = jumlahJadwal(ctx);
      const D1 = d1Gagal(ctx.D1, /INSERT INTO jadwal_konsultasi/i);
      const res = await buat({ idKonsultan: "k1", waktu: "2031-06-01T07:00:00Z", waktuSelesai: "2031-06-01T08:00:00Z" }, admin, D1);
      expect(res.status).toBe(500);
      const galat = (await json(res)).error;
      expect(galat.kode).toBe("GAGAL_MENYIMPAN_JADWAL");
      expect(galat.pesan).toBe("Perubahan jadwal gagal disimpan. Tekan Simpan sekali lagi.");
      expect(jumlahJadwal(ctx)).toBe(sebelum);
    });

    test("mahasiswa 403, tanpa token 401, body bukan JSON 400", async () => {
      const body = { idKonsultan: "k1", waktu: "2031-06-01T07:00:00Z", waktuSelesai: "2031-06-01T08:00:00Z" };
      expect((await buat(body, mhs)).status).toBe(403);
      expect((await minta(app, ctx.D1, { method: "POST", path: "/api/slots", body })).status).toBe(401);
      const res = await app.fetch(
        new Request("http://sehati.test/api/slots", {
          method: "POST",
          headers: { Authorization: `Bearer ${admin}`, "Content-Type": "application/json" },
          body: "{bukan json",
        }),
        envUji(ctx.D1),
        {} as ExecutionContext,
      );
      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /api/slots/:id — perbaruiJadwal", () => {
    test("200: mengubah jendela slot dan menyimpannya dalam bentuk kanonik", async () => {
      const res = await ubah(J2.id, { waktu: "2031-06-01T06:00:00Z", waktuSelesai: "2031-06-01T07:00:00Z" });
      expect(res.status).toBe(200);
      expect(barisJadwal(ctx, J2.id)).toMatchObject({
        waktu: "2031-06-01T06:00:00.000Z",
        waktu_selesai: "2031-06-01T07:00:00.000Z",
      });
    });

    test("hanya waktuSelesai yang dikirim: waktu mulai lama dipertahankan", async () => {
      const res = await ubah(J2.id, { waktuSelesai: "2031-06-01T06:30:00Z" });
      expect(res.status).toBe(200);
      expect(barisJadwal(ctx, J2.id)).toMatchObject({ waktu_selesai: "2031-06-01T06:30:00.000Z" });
    });

    test("menyimpan ulang jendela yang sama tidak bentrok dengan dirinya sendiri", async () => {
      const res = await ubah(J1.id, { waktu: J1.mulai, waktuSelesai: J1.selesai });
      expect(res.status).toBe(200);
    });

    test("422 bila waktu selesai tidak setelah waktu mulai, data lama utuh", async () => {
      const res = await ubah(J1.id, { waktu: "2031-06-01T04:00:00Z", waktuSelesai: "2031-06-01T04:00:00Z" });
      expect(res.status).toBe(422);
      expect(barisJadwal(ctx, J1.id)).toMatchObject({ waktu: J1.mulai, waktu_selesai: J1.selesai });
    });

    test("422 bila hanya waktuSelesai dikirim dan jatuh sebelum waktu mulai lama", async () => {
      const res = await ubah(J1.id, { waktuSelesai: "2031-06-01T02:00:00Z" });
      expect(res.status).toBe(422);
    });

    test("422 bila waktu bukan ISO 8601", async () => {
      expect((await ubah(J1.id, { waktu: "siang", waktuSelesai: "2031-06-01T04:00:00Z" })).status).toBe(422);
      expect((await ubah(J1.id, { waktu: "", waktuSelesai: "2031-06-01T04:00:00Z" })).status).toBe(422);
      expect((await ubah(J1.id, { waktu: 123, waktuSelesai: "2031-06-01T04:00:00Z" })).status).toBe(422);
    });

    test("409 bila hasil edit menabrak slot lain konsultan yang sama, data lama utuh", async () => {
      const res = await ubah(J1.id, { waktu: "2031-06-01T04:30:00Z", waktuSelesai: "2031-06-01T05:30:00Z" });
      expect(res.status).toBe(409);
      expect((await json(res)).error.kode).toBe("JADWAL_BENTROK");
      expect(barisJadwal(ctx, J1.id)).toMatchObject({ waktu: J1.mulai, waktu_selesai: J1.selesai });
    });

    test("memperluas slot hingga menempel pada slot berikutnya diperbolehkan", async () => {
      const res = await ubah(J1.id, { waktuSelesai: "2031-06-01T05:00:00Z" });
      expect(res.status).toBe(200);
    });

    test("slot yang sudah dipesan boleh digeser dan tetap terpesan oleh mahasiswa yang sama", async () => {
      ctx.raw.exec(`UPDATE jadwal_konsultasi SET status = 'terpesan', id_mahasiswa = 'mhs' WHERE id_jadwal = 'j1'`);
      const res = await ubah(J1.id, { waktu: "2031-06-01T03:30:00Z", waktuSelesai: "2031-06-01T04:30:00Z" });
      expect(res.status).toBe(200);
      expect(barisJadwal(ctx, J1.id)).toMatchObject({ status: "terpesan", id_mahasiswa: "mhs" });
    });

    test("404 untuk slot yang tidak ada", async () => {
      const res = await ubah("tidak-ada", { waktu: J1.mulai, waktuSelesai: J1.selesai });
      expect(res.status).toBe(404);
    });

    test("alternatif 2: database gagal menyimpan -> 500 dengan pesan I-12-07, data lama utuh", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      const D1 = d1Gagal(ctx.D1, /UPDATE jadwal_konsultasi/i);
      const res = await ubah(J1.id, { waktu: "2031-06-01T03:30:00Z", waktuSelesai: "2031-06-01T04:30:00Z" }, admin, D1);
      expect(res.status).toBe(500);
      const galat = (await json(res)).error;
      expect(galat.kode).toBe("GAGAL_MENYIMPAN_JADWAL");
      expect(galat.pesan).toBe("Perubahan jadwal gagal disimpan. Tekan Simpan sekali lagi.");
      expect(barisJadwal(ctx, J1.id)).toMatchObject({ waktu: J1.mulai, waktu_selesai: J1.selesai });
    });

    test("mahasiswa 403", async () => {
      const res = await ubah(J1.id, { waktu: J1.mulai, waktuSelesai: J1.selesai }, mhs);
      expect(res.status).toBe(403);
    });
  });
});
