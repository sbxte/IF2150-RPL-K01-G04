import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import app from "../src/index";
import { buatDbUji, buatSesiUji } from "./harness";
import { json, minta } from "./util";

describe("FeedbackController (C-31)", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let mhs: string;
  let mhs2: string;
  let admin: string;

  beforeEach(() => {
    ctx = buatDbUji();
    mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm", nama: "Ana" });
    mhs2 = buatSesiUji(ctx.raw, { idPengguna: "mhs2", peran: "mahasiswa", token: "tm2", nama: "Budi" });
    admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
  });
  afterEach(() => ctx.tutup());

  test("POST /api/feedback menyimpan umpan balik (Q-038)", async () => {
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/feedback",
      token: mhs,
      body: { isi: "Aplikasinya bagus" },
    });
    expect(res.status).toBe(201);

    const baris = ctx.raw
      .prepare("SELECT isi, id_mahasiswa FROM umpan_balik")
      .get() as { isi: string; id_mahasiswa: string };
    expect(baris).toEqual({ isi: "Aplikasinya bagus", id_mahasiswa: "mhs" });
  });

  test("POST /api/feedback menolak isi kosong", async () => {
    const res = await minta(app, ctx.D1, {
      method: "POST",
      path: "/api/feedback",
      token: mhs,
      body: { isi: "  " },
    });
    expect(res.status).toBe(422);
  });

  test("GET /api/feedback hanya untuk administrator (403 untuk mahasiswa)", async () => {
    const res = await minta(app, ctx.D1, { path: "/api/feedback", token: mhs });
    expect(res.status).toBe(403);
  });

  test("GET /api/feedback terbaru lebih dulu + nama pengirim (Q-016)", async () => {
    await minta(app, ctx.D1, { method: "POST", path: "/api/feedback", token: mhs, body: { isi: "pertama" } });
    await minta(app, ctx.D1, { method: "POST", path: "/api/feedback", token: mhs2, body: { isi: "kedua" } });

    const body = await json(await minta(app, ctx.D1, { path: "/api/feedback", token: admin }));
    expect(body.feedback.map((f: any) => f.isi)).toEqual(["kedua", "pertama"]);
    expect(body.feedback[0].namaMahasiswa).toBe("Budi");
    expect(body.feedback[0].tanggapan).toBeNull();
  });

  test("pagination limit/offset", async () => {
    for (const isi of ["a", "b", "c"]) {
      await minta(app, ctx.D1, { method: "POST", path: "/api/feedback", token: mhs, body: { isi } });
    }
    const body = await json(
      await minta(app, ctx.D1, { path: "/api/feedback?limit=1&offset=1", token: admin }),
    );
    expect(body.feedback).toHaveLength(1);
    expect(body.feedback[0].isi).toBe("b");
    expect(body).toMatchObject({ limit: 1, offset: 1 });
  });

  test("limit dijepit pada maksimum", async () => {
    const body = await json(
      await minta(app, ctx.D1, { path: "/api/feedback?limit=9999", token: admin }),
    );
    expect(body.limit).toBe(200);
  });

  test("PUT /api/feedback/:id/response menyimpan tanggapan + id_administrator (Q-039)", async () => {
    const dibuat = await json(
      await minta(app, ctx.D1, {
        method: "POST",
        path: "/api/feedback",
        token: mhs,
        body: { isi: "tolong" },
      }),
    );

    const res = await minta(app, ctx.D1, {
      method: "PUT",
      path: `/api/feedback/${dibuat.idUmpanBalik}/response`,
      token: admin,
      body: { tanggapan: "sudah kami tangani" },
    });
    expect(res.status).toBe(200);

    const baris = ctx.raw
      .prepare("SELECT tanggapan, id_administrator FROM umpan_balik WHERE id_umpan_balik = ?")
      .get(dibuat.idUmpanBalik) as { tanggapan: string; id_administrator: string };
    expect(baris).toEqual({ tanggapan: "sudah kami tangani", id_administrator: "adm" });
  });

  test("tanggapan kosong ditolak", async () => {
    const res = await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/feedback/apa-saja/response",
      token: admin,
      body: { tanggapan: "" },
    });
    expect(res.status).toBe(422);
  });

  test("tanggapan untuk umpan balik tak dikenal -> 404", async () => {
    const res = await minta(app, ctx.D1, {
      method: "PUT",
      path: "/api/feedback/tidak-ada/response",
      token: admin,
      body: { tanggapan: "halo" },
    });
    expect(res.status).toBe(404);
  });
});

describe("ServerStatusController (C-32) / Algo-020", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let mhs: string;

  beforeEach(() => {
    ctx = buatDbUji(`
      INSERT INTO status_server (jenis, status_uptime, waktu_cek) VALUES
        ('db', 1, '2031-01-01T00:00:00Z'),
        ('db', 0, '2031-01-02T00:00:00Z'),
        ('server',  1, '2031-01-03T00:00:00Z');
    `);
    mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
  });
  afterEach(() => ctx.tutup());

  test("mengembalikan pemeriksaan terakhir untuk jenis tertentu (Q-017)", async () => {
    const body = await json(await minta(app, ctx.D1, { path: "/api/status/db", token: mhs }));
    expect(body.status).toMatchObject({ jenis: "db", statusUptime: false });
    expect(body.status.waktuCek).toBe("2031-01-02T00:00:00Z");
  });

  test("null bila belum ada pemeriksaan", async () => {
    const body = await json(await minta(app, ctx.D1, { path: "/api/status/server", token: mhs }));
    expect(body.status).toMatchObject({ jenis: "server", statusUptime: true });
  });

  test("jenis tidak dikenal -> 422", async () => {
    const res = await minta(app, ctx.D1, { path: "/api/status/website", token: mhs });
    expect(res.status).toBe(422);
  });
});

describe("GET /api/status/history (I-15-05, Q-044)", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let mhs: string;

  beforeEach(() => {
    ctx = buatDbUji(`
      INSERT INTO status_server (jenis, status_uptime, waktu_cek) VALUES
        ('server', 1, '2031-01-01T00:00:00Z'),
        ('db',     0, '2031-01-02T00:00:00Z'),
        ('server', 1, '2031-01-03T00:00:00Z');
    `);
    mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
  });
  afterEach(() => ctx.tutup());

  test("mengembalikan riwayat terbaru lebih dulu", async () => {
    const body = await json(await minta(app, ctx.D1, { path: "/api/status/history", token: mhs }));

    expect(body.riwayat.map((r: any) => r.waktuCek)).toEqual([
      "2031-01-03T00:00:00Z",
      "2031-01-02T00:00:00Z",
      "2031-01-01T00:00:00Z",
    ]);
    expect(body.riwayat[0]).toMatchObject({ jenis: "server", statusUptime: true });
  });

  test("bukan ditelan rute /:jenis", async () => {
    // `/history` is registered first; otherwise `/:jenis` would 422 here.
    const res = await minta(app, ctx.D1, { path: "/api/status/history", token: mhs });
    expect(res.status).toBe(200);
  });

  test("?limit menjepit jumlah baris dan tidak melebihi batas", async () => {
    const dua = await json(await minta(app, ctx.D1, { path: "/api/status/history?limit=2", token: mhs }));
    expect(dua.riwayat).toHaveLength(2);
    expect(dua.limit).toBe(2);

    const besar = await json(await minta(app, ctx.D1, { path: "/api/status/history?limit=9999", token: mhs }));
    expect(besar.limit).toBe(100);
  });

  test("daftar kosong bila belum ada pemeriksaan", async () => {
    const ctx2 = buatDbUji();
    const t = buatSesiUji(ctx2.raw, { idPengguna: "x", peran: "mahasiswa", token: "tx" });
    const body = await json(await minta(app, ctx2.D1, { path: "/api/status/history", token: t }));
    expect(body.riwayat).toEqual([]);
    ctx2.tutup();
  });
});

describe("POST /api/status/refresh (I-15 Periksa Sekarang)", () => {
  let ctx: ReturnType<typeof buatDbUji>;
  let admin: string;
  let mhs: string;
  let fetchAsli: typeof fetch;

  beforeEach(() => {
    ctx = buatDbUji();
    admin = buatSesiUji(ctx.raw, { idPengguna: "adm", peran: "administrator", token: "ta" });
    mhs = buatSesiUji(ctx.raw, { idPengguna: "mhs", peran: "mahasiswa", token: "tm" });
    fetchAsli = globalThis.fetch;
  });
  afterEach(() => {
    globalThis.fetch = fetchAsli;
    vi.restoreAllMocks();
    ctx.tutup();
  });

  /** Records what the route spent so the cost guard is observable. */
  function tiruProbe(status = 200) {
    const dipanggil: string[] = [];
    globalThis.fetch = vi.fn(async (input: any) => {
      dipanggil.push(String(input?.url ?? input));
      return new Response("ok", { status });
    }) as any;
    return dipanggil;
  }

  test("menjalankan probe dan mengembalikan hasil segar", async () => {
    const dipanggil = tiruProbe(200);

    const res = await minta(app, ctx.D1, { method: "POST", path: "/api/status/refresh", token: admin });
    expect(res.status).toBe(200);

    const body = await json(res);
    expect(body.diperiksa).toBe(true);
    expect(new Set(dipanggil).size).toBe(2); // one per jenis
    // Both rows exist and are up, read back from the table.
    expect(body.status.server).toMatchObject({ jenis: "server", statusUptime: true });
    expect(body.status.db).toMatchObject({ jenis: "db", statusUptime: true });
  });

  test("menolak mahasiswa: probe itu biaya keluar, bukan bacaan biasa", async () => {
    const dipanggil = tiruProbe(200);
    const res = await minta(app, ctx.D1, { method: "POST", path: "/api/status/refresh", token: mhs });
    expect(res.status).toBe(403);
    expect(dipanggil).toHaveLength(0);
  });

  test("menolak tanpa sesi", async () => {
    const res = await minta(app, ctx.D1, { method: "POST", path: "/api/status/refresh" });
    expect(res.status).toBe(401);
  });

  test("tidak memprobe ulang bila hasilnya masih segar (anti-loop)", async () => {
    const dipanggil = tiruProbe(200);

    // Two presses in a row: the second must reuse the first result.
    await minta(app, ctx.D1, { method: "POST", path: "/api/status/refresh", token: admin });
    expect(dipanggil).toHaveLength(2);

    const kedua = await json(
      await minta(app, ctx.D1, { method: "POST", path: "/api/status/refresh", token: admin }),
    );
    expect(kedua.diperiksa).toBe(false);
    expect(dipanggil).toHaveLength(2); // unchanged: no new outbound requests
  });

  test("memprobe lagi setelah hasil lama melewati batas segar", async () => {
    const dipanggil = tiruProbe(200);
    await minta(app, ctx.D1, { method: "POST", path: "/api/status/refresh", token: admin });
    expect(dipanggil).toHaveLength(2);

    // Age both rows past PROBE_SEGAR_MS.
    ctx.raw.exec("UPDATE status_server SET waktu_cek = datetime('now', '-5 minutes')");

    const lagi = await json(
      await minta(app, ctx.D1, { method: "POST", path: "/api/status/refresh", token: admin }),
    );
    expect(lagi.diperiksa).toBe(true);
    expect(dipanggil).toHaveLength(4);
  });

  test("mencatat down ketika probe gagal", async () => {
    tiruProbe(500);
    const body = await json(
      await minta(app, ctx.D1, { method: "POST", path: "/api/status/refresh", token: admin }),
    );
    expect(body.status.server).toMatchObject({ statusUptime: false });
    expect(body.status.db).toMatchObject({ statusUptime: false });
  });
});

describe("Rute tak dikenal", () => {
  test("mengembalikan 404 dengan envelope error", async () => {
    const ctx = buatDbUji();
    const res = await minta(app, ctx.D1, { path: "/api/tidak-ada" });
    expect(res.status).toBe(404);
    expect((await json(res)).error.kode).toBe("TIDAK_DITEMUKAN");
    ctx.tutup();
  });
});
