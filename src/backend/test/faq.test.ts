import { afterEach, beforeEach, describe, expect, test } from "vitest";
import app from "../src/index";
import { buatDbUji, buatSesiUji } from "./harness";
import { json, minta } from "./util";

describe("FAQ (C-30)", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let admin: string;
  let mhs: string;

  beforeEach(() => {
    ctx = buatDbUji(`
      INSERT INTO faq (id_faq, pertanyaan, jawaban) VALUES
        ('f1', 'Apa itu Sehati?', 'Aplikasi kesehatan mental.'),
        ('f2', 'Cara pesan sesi?', 'Buka menu konsultasi.'),
        ('f3', 'Diskon 100%?', 'Tidak ada diskon.');
    `);
    admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
  });
  afterEach(() => ctx.tutup());

  test("GET /api/faq mengembalikan seluruh FAQ terurut (Q-015)", async () => {
    const res = await minta(app, ctx.D1, { path: "/api/faq", token: mhs });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.faq.map((f: any) => f.idFaq)).toEqual(["f1", "f2", "f3"]);
  });

  test("GET /api/faq?q= mencari pertanyaan maupun jawaban (Algo-017)", async () => {
    const res = await minta(app, ctx.D1, { path: "/api/faq?q=pesan", token: mhs });
    const body = await json(res);
    expect(body.faq.map((f: any) => f.idFaq)).toEqual(["f2"]);
  });

  test("pencarian meng-escape wildcard LIKE", async () => {
    // '100%' must match literally, not act as a wildcard.
    const kena = await json(await minta(app, ctx.D1, { path: "/api/faq?q=100%25", token: mhs }));
    expect(kena.faq.map((f: any) => f.idFaq)).toEqual(["f3"]);

    // A bare '%' is escaped, so it matches only text containing '%'.
    const kosong = await json(await minta(app, ctx.D1, { path: "/api/faq?q=_", token: mhs }));
    expect(kosong.faq).toEqual([]);
  });

  test("keyword kosong menampilkan semua", async () => {
    const body = await json(await minta(app, ctx.D1, { path: "/api/faq?q=%20%20", token: mhs }));
    expect(body.faq).toHaveLength(3);
  });

  test("GET /api/faq?urut=za mengurutkan terbalik (B.1 no. 12)", async () => {
    const body = await json(await minta(app, ctx.D1, { path: "/api/faq?urut=za", token: mhs }));
    expect(body.faq.map((f: any) => f.idFaq)).toEqual(["f3", "f2", "f1"]);
  });

  test("GET /api/faq?urut=baru memakai waktu_dibuat, baris lama di akhir (B.1 no. 12)", async () => {
    const atur = ctx.raw.prepare("UPDATE faq SET waktu_dibuat = ? WHERE id_faq = ?");
    atur.run("2026-11-01T08:00:00.000Z", "f1");
    atur.run("2026-11-05T08:00:00.000Z", "f3");
    // f2 keeps NULL and must sort last.

    const body = await json(await minta(app, ctx.D1, { path: "/api/faq?urut=baru", token: mhs }));
    expect(body.faq.map((f: any) => f.idFaq)).toEqual(["f3", "f1", "f2"]);
  });

  test("urut tak dikenal kembali ke A–Z", async () => {
    const body = await json(await minta(app, ctx.D1, { path: "/api/faq?urut=acak", token: mhs }));
    expect(body.faq.map((f: any) => f.idFaq)).toEqual(["f1", "f2", "f3"]);
  });

  test("POST /api/faq membuat FAQ baru (Q-035)", async () => {
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/faq",
      token: admin,
      body: { pertanyaan: "Baru?", jawaban: "Ya." },
    });
    expect(res.status).toBe(201);
    const body = await json(res);
    expect(body.idFaq).toBeTruthy();

    const baris = ctx.raw
      .prepare("SELECT pertanyaan, waktu_dibuat FROM faq WHERE id_faq = ?")
      .get(body.idFaq) as { pertanyaan: string; waktu_dibuat: string };
    expect(baris.pertanyaan).toBe("Baru?");
    // B.1 no. 12: the route stamps the creation time for the "Terbaru" sort.
    expect(Number.isNaN(Date.parse(baris.waktu_dibuat))).toBe(false);
  });

  test("POST /api/faq menolak isian kosong (Algo-026)", async () => {
    for (const body of [
      { pertanyaan: "", jawaban: "x" },
      { pertanyaan: "x", jawaban: "   " },
      { pertanyaan: "x" },
    ]) {
      const res = await minta(app, ctx.D1, { method: "POST", path: "/api/faq", token: admin, body });
      expect(res.status).toBe(422);
    }
  });

  test("PUT /api/faq/:id mengubah FAQ (Q-036)", async () => {
    const res = await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/faq/f1",
      token: admin,
      body: { pertanyaan: "Apa itu Sehati? (revisi)", jawaban: "Jawaban baru." },
    });
    expect(res.status).toBe(200);

    const baris = ctx.raw.prepare("SELECT jawaban FROM faq WHERE id_faq = 'f1'").get() as {
      jawaban: string;
    };
    expect(baris.jawaban).toBe("Jawaban baru.");
  });

  test("PUT /api/faq/:id mengembalikan 404 untuk id tak dikenal", async () => {
    const res = await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/faq/tidak-ada",
      token: admin,
      body: { pertanyaan: "a", jawaban: "b" },
    });
    expect(res.status).toBe(404);
  });

  test("DELETE /api/faq/:id menghapus FAQ (Q-037)", async () => {
    const res = await minta(app, ctx.D1, { method: "DELETE", path: "/api/faq/f2", token: admin });
    expect(res.status).toBe(200);
    const jumlah = ctx.raw.prepare("SELECT COUNT(*) AS n FROM faq").get() as { n: number };
    expect(jumlah.n).toBe(2);
  });

  test("DELETE /api/faq/:id 404 untuk id tak dikenal", async () => {
    const res = await minta(app, ctx.D1, {
      method: "DELETE",
      path: "/api/faq/tidak-ada",
      token: admin,
    });
    expect(res.status).toBe(404);
  });
});

describe("PengajuanPertanyaan (UC-12)", () => {
  test("POST /api/questions menyimpan pertanyaan (Q-040)", async () => {
    const ctx = buatDbUji();
    const mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });

    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/questions",
      token: mhs,
      body: { isi: "Bagaimana cara ganti konsultan?" },
    });
    expect(res.status).toBe(201);

    const baris = ctx.raw
      .prepare("SELECT isi_pertanyaan, id_mahasiswa, waktu_pengajuan FROM pengajuan_pertanyaan")
      .get() as { isi_pertanyaan: string; id_mahasiswa: string; waktu_pengajuan: string };
    expect(baris.isi_pertanyaan).toBe("Bagaimana cara ganti konsultan?");
    expect(baris.id_mahasiswa).toBe("mhs");
    // B.1 no. 11: the submission time is recorded so the admin list can sort it.
    expect(Number.isNaN(Date.parse(baris.waktu_pengajuan))).toBe(false);
    ctx.tutup();
  });

  test("menolak pertanyaan kosong", async () => {
    const ctx = buatDbUji();
    const mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/questions",
      token: mhs,
      body: { isi: "   " },
    });
    expect(res.status).toBe(422);
    ctx.tutup();
  });

  test("administrator tidak boleh mengajukan pertanyaan", async () => {
    const ctx = buatDbUji();
    const admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/questions",
      token: admin,
      body: { isi: "x" },
    });
    expect(res.status).toBe(403);
    ctx.tutup();
  });

  test("GET /api/questions khusus administrator, terbaru dulu dan memuat nama (B.1 no. 11)", async () => {
    const ctx = buatDbUji();
    const admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    const mhs = buatSesiUji(ctx.raw, {
      idPengguna: "mhs",
      peran: "mahasiswa",
      token: "tm",
      nama: "Sari",
    });
    ctx.raw
      .prepare(
        `INSERT INTO pengajuan_pertanyaan
           (id_pertanyaan, id_mahasiswa, isi_pertanyaan, waktu_pengajuan)
         VALUES (?, ?, ?, ?)`,
      )
      .run("p1", "mhs", "Pertanyaan lama", "2026-11-10T08:00:00.000Z");
    ctx.raw
      .prepare(
        `INSERT INTO pengajuan_pertanyaan
           (id_pertanyaan, id_mahasiswa, isi_pertanyaan, waktu_pengajuan)
         VALUES (?, ?, ?, ?)`,
      )
      .run("p2", "mhs", "Pertanyaan baru", "2026-11-12T08:00:00.000Z");

    const res = await minta(app, ctx.D1, { path: "/api/questions", token: admin });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.pertanyaan.map((p: any) => p.idPertanyaan)).toEqual(["p2", "p1"]);
    expect(body.pertanyaan[0]).toMatchObject({
      isiPertanyaan: "Pertanyaan baru",
      nama: "Sari",
      waktuPengajuan: "2026-11-12T08:00:00.000Z",
    });

    const tolak = await minta(app, ctx.D1, { path: "/api/questions", token: mhs });
    expect(tolak.status).toBe(403);
    ctx.tutup();
  });

  test("GET /api/questions?q= mencari isi pertanyaan maupun nama Mahasiswa (B.1 no. 11)", async () => {
    const ctx = buatDbUji();
    const admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    buatSesiUji(ctx.raw, { idPengguna: "m1", peran: "mahasiswa", token: "t1", nama: "Sari" });
    buatSesiUji(ctx.raw, { idPengguna: "m2", peran: "mahasiswa", token: "t2", nama: "Budi" });
    const tambah = ctx.raw.prepare(
      "INSERT INTO pengajuan_pertanyaan (id_pertanyaan, id_mahasiswa, isi_pertanyaan) VALUES (?,?,?)",
    );
    tambah.run("p1", "m1", "Cara ganti pembimbing?");
    tambah.run("p2", "m2", "Jadwal kosong minggu ini?");
    tambah.run("p3", "m1", "Diskon 100%?");

    const cari = async (q: string) =>
      (await json(await minta(app, ctx.D1, { path: `/api/questions?q=${q}`, token: admin })))
        .pertanyaan as any[];

    expect((await cari("pembimbing")).map((p) => p.idPertanyaan)).toEqual(["p1"]);
    // Matches the joined student name as well.
    expect((await cari("Sari")).map((p) => p.idPertanyaan)).toEqual(["p3", "p1"]);
    // Wildcards are escaped, so '%' and '_' match literally.
    expect((await cari("100%25")).map((p) => p.idPertanyaan)).toEqual(["p3"]);
    expect(await cari("_")).toEqual([]);
    // A blank keyword lists everything.
    expect(await cari("%20%20")).toHaveLength(3);
    ctx.tutup();
  });

  test("GET /api/questions?sejak=&sampai= membatasi waktu pengajuan (B.1 no. 11)", async () => {
    const ctx = buatDbUji();
    const admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    buatSesiUji(ctx.raw, { idPengguna: "m1", peran: "mahasiswa", token: "t1" });
    const tambah = ctx.raw.prepare(
      `INSERT INTO pengajuan_pertanyaan
         (id_pertanyaan, id_mahasiswa, isi_pertanyaan, waktu_pengajuan)
       VALUES (?,?,?,?)`,
    );
    tambah.run("p1", "m1", "Lama", "2026-11-10T08:00:00.000Z");
    tambah.run("p2", "m1", "Baru", "2026-11-12T08:00:00.000Z");
    tambah.run("p3", "m1", "Tanpa tanggal", null);

    const id = async (kueri: string) =>
      (
        await json(await minta(app, ctx.D1, { path: `/api/questions${kueri}`, token: admin }))
      ).pertanyaan.map((p: any) => p.idPertanyaan);

    // Undated legacy rows only show without a time filter.
    expect(await id("")).toEqual(["p2", "p1", "p3"]);
    expect(await id("?sejak=2026-11-11T00:00:00.000Z")).toEqual(["p2"]);
    expect(await id("?sampai=2026-11-10T23:59:59.999Z")).toEqual(["p1"]);
    expect(
      await id("?sejak=2026-11-09T00:00:00.000Z&sampai=2026-11-10T23:59:59.999Z"),
    ).toEqual(["p1"]);
    ctx.tutup();
  });

  test("DELETE /api/questions/:id menghapus pertanyaan (B.1 no. 11)", async () => {
    const ctx = buatDbUji();
    const admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    const mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
    ctx.raw
      .prepare("INSERT INTO pengajuan_pertanyaan (id_pertanyaan, id_mahasiswa, isi_pertanyaan) VALUES (?,?,?)")
      .run("p1", "mhs", "Hapus saya");

    const res = await minta(app, ctx.D1, {
      method: "DELETE",
      path: "/api/questions/p1",
      token: admin,
    });
    expect(res.status).toBe(200);
    const jumlah = ctx.raw
      .prepare("SELECT COUNT(*) AS n FROM pengajuan_pertanyaan")
      .get() as { n: number };
    expect(jumlah.n).toBe(0);

    const tidakAda = await minta(app, ctx.D1, {
      method: "DELETE",
      path: "/api/questions/p1",
      token: admin,
    });
    expect(tidakAda.status).toBe(404);

    const tolak = await minta(app, ctx.D1, {
      method: "DELETE",
      path: "/api/questions/p1",
      token: mhs,
    });
    expect(tolak.status).toBe(403);
    ctx.tutup();
  });
});
