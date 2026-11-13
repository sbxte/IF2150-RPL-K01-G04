import { Hono } from "hono";
import {
  ambilSlot,
  ambilSesiBerikutnya,
  daftarKonsultan,
  jadwalKonsultan,
  konsultanAda,
  pesanSlot,
  semuaJadwal,
  sesiTumpangTindih,
  sesiMahasiswaPadaHari,
} from "../db/queries";
import { bacaConfig } from "../config";
import {
  bentrokJadwal,
  bentrokGoogleCalendar,
  gagalSimpanJadwal,
  gagalValidasi,
  slotSudahDipesan,
  tidakDitemukan,
} from "../lib/errors";
import { bacaBody } from "../lib/http";
import { perbaruiJadwal, simpanJadwal } from "../lib/jadwal-konsultasi";
import { periksaJadwal, validasiRentangJadwal } from "../lib/validasi";
import {
  ambilKalender,
  cekBentrokJadwal,
  type EventGoogle,
} from "../lib/google";
import { auth, requireRole, type AppEnv } from "../middleware/auth";
import { gabungkanJadwal } from "../lib/kalender";

export const calendarRoutes = new Hono<AppEnv>();

/* -------------------------------------------------------------------------- */
/* CalendarController (C-28) — Algo-009 / Algo-011                            */
/* -------------------------------------------------------------------------- */


/** C-28 `tampilkanCalendar()` — UC-03. Google failure degrades to slots only. */
calendarRoutes.get("/", auth, requireRole("mahasiswa"), async (c) => {
  const db = c.get("db");
  const cfg = bacaConfig(c.env);

  const timeMin = c.req.query("dari") ?? new Date().toISOString();
  const timeMax =
    c.req.query("sampai") ?? new Date(Date.now() + 30 * 86_400_000).toISOString();
  const rentang = validasiRentangJadwal(timeMin, timeMax);
  if (!rentang) {
    throw gagalValidasi("Parameter dari dan sampai harus berupa ISO-8601 valid dengan sampai > dari");
  }
  const dari = rentang.mulai.toISOString();
  const sampai = rentang.selesai.toISOString();

  const idMahasiswa = c.get("idPengguna");
  const jadwal = await semuaJadwal(db, dari, sampai); // Q-013

  let google: EventGoogle[] = [];
  let mode: "google" | "mock" = "mock";
  let peringatan: string | undefined;
  try {
    const hasilGoogle = await ambilKalender(db, c.get("idPengguna"), cfg, dari, sampai); // Algo-009
    google = hasilGoogle.events;
    mode = hasilGoogle.mode;
  } catch (error) {
    // CalendarView.showErrorMessage() offers a Refresh action instead of failing hard.
    peringatan =
      error instanceof Error ? error.message : "Gagal mengambil event Google Calendar";
  }

  return c.json({
    events: gabungkanJadwal(google, jadwal, idMahasiswa), // Algo-011: per-student visibility
    mode,
    peringatan,
  });
});

/* -------------------------------------------------------------------------- */
/* ConsultationController (C-29) — UC-04 / UC-05                              */
/* -------------------------------------------------------------------------- */

export const consultantRoutes = new Hono<AppEnv>();
export const slotRoutes = new Hono<AppEnv>();
export const sessionRoutes = new Hono<AppEnv>();

/** C-29 `tampilkanOpsiKonsultasi()` — Q-012. */
consultantRoutes.get("/", auth, async (c) => {
  const daftar = await daftarKonsultan(c.get("db"));
  return c.json({ consultants: daftar });
});

/**
 * Midnight (WIB) of today as an ISO instant. The administrator's list starts here, so a
 * slot that began earlier today can still be seen and corrected.
 */
function awalHariWib(sekarang = new Date()): string {
  const WIB_MS = 7 * 3_600_000;
  const hari = 86_400_000;
  return new Date(Math.floor((sekarang.getTime() + WIB_MS) / hari) * hari - WIB_MS).toISOString();
}

/**
 * C-29 `submitKonsultan(konsultan)` — Algo-024 then Algo-015 (Q-019, Q-014).
 *  - Mahasiswa: only open slots, minus days they already have a session (UC-04).
 *  - Administrator: every slot from today on, open and booked, for I-12 (UC-05).
 */
consultantRoutes.get("/:id/slots", auth, async (c) => {
  const db = c.get("db");
  const idKonsultan = c.req.param("id");

  const [ada] = await konsultanAda(db, idKonsultan); // Q-019
  if (!ada) throw tidakDitemukan("Konsultan tidak ditemukan");

  if (c.get("peran") === "administrator") {
    const slots = await jadwalKonsultan(db, idKonsultan, awalHariWib()); // Q-014
    return c.json({ slots });
  }

  const sekarang = new Date().toISOString();
  const slots = await jadwalKonsultan(db, idKonsultan, sekarang); // Q-014
  // Issue #11: hide every slot on a day where this student already has a Sehati session.
  const bookedDays = new Set<string>();
  const booked = await db.$client.prepare(
    "SELECT DISTINCT substr(waktu, 1, 10) AS tanggal FROM jadwal_konsultasi WHERE id_mahasiswa = ? AND status = 'terpesan'",
  ).bind(c.get("idPengguna")).all<{ tanggal: string }>();
  for (const row of booked.results ?? []) bookedDays.add(row.tanggal);
  return c.json({ slots: slots.filter((slot) => slot.status === "tersedia" && !bookedDays.has(slot.waktu.slice(0, 10))) });
});

/** C-29 `ambilSesiBerikutnya()` — Q-042, for the beranda card. */
sessionRoutes.get("/next", auth, requireRole("mahasiswa"), async (c) => {
  const [sesi] = await ambilSesiBerikutnya(
    c.get("db"),
    c.get("idPengguna"),
    new Date().toISOString(),
  );
  return c.json({ session: sesi ?? null });
});

/**
 * UC-04 — Algo-022 student branch + Algo-012 `jadwalBentrok` + Algo-029 Q-028.
 *  1. slot must exist and still be available
 *  2. an existing Sehati session on the same day -> hard 409
 *  3. Google Calendar day conflict -> confirmable 409 unless overrideGoogle=true
 *  4. another booked session overlap + guarded Q-028 remain hard conflicts
 */
slotRoutes.post("/:id/book", auth, requireRole("mahasiswa"), async (c) => {
  const db = c.get("db");
  const cfg = bacaConfig(c.env);
  const idJadwal = c.req.param("id");
  const idMahasiswa = c.get("idPengguna");

  const [slot] = await ambilSlot(db, idJadwal);
  if (!slot) throw tidakDitemukan("Slot jadwal tidak ditemukan");
  if (slot.status !== "tersedia") throw slotSudahDipesan();

  const body = await c.req.json().catch(() => ({})) as Record<string, unknown>;
  const overrideGoogle = body.overrideGoogle === true;

  // A Sehati session blocks the entire calendar day, not merely overlapping hours.
  const [sesiHariItu] = await sesiMahasiswaPadaHari(db, idMahasiswa, slot.waktu.slice(0, 10));
  if (sesiHariItu) throw bentrokJadwal("Anda sudah memiliki sesi konsultasi Sehati pada hari tersebut");

  // Google Calendar is advisory: require an explicit override, but never mutate Google events.
  if (!overrideGoogle) {
    const awalHari = new Date(slot.waktu);
    awalHari.setUTCHours(0, 0, 0, 0);
    const akhirHari = new Date(awalHari);
    akhirHari.setUTCDate(akhirHari.getUTCDate() + 1);
    const bentrokGoogle = await cekBentrokJadwal(
      db, idMahasiswa, cfg, awalHari.toISOString(), akhirHari.toISOString(),
    );
    if (bentrokGoogle) throw bentrokGoogleCalendar();
  }

  // Keep overlap validation as a separate hard guard (including race-safe slot update below).
  const [tumpang] = await sesiTumpangTindih(db, {
    idMahasiswa, waktu: slot.waktu, waktuSelesai: slot.waktuSelesai,
  });
  if (tumpang) throw bentrokJadwal("Anda sudah memiliki sesi lain pada waktu tersebut");

  // Algo-029 student branch: Q-028 guarded by `status = 'tersedia'`.
  const hasil = await pesanSlot(db, { idJadwal, idMahasiswa });
  const terubah = hasil.meta?.changes ?? 0;
  if (terubah !== 1) throw slotSudahDipesan();

  return c.json({ ok: true, idJadwal, status: "terpesan" });
});

/** UC-05 — turns a rejected `validasiJadwal` (Algo-025) into the HTTP error the screen shows. */
function tolakJadwal(alasan: string, pesan: string) {
  return alasan === "TUMPANG_TINDIH" ? bentrokJadwal(pesan) : gagalValidasi(pesan);
}

/**
 * UC-05 — administrator adds a slot (I-12-09 "Tambah Slot").
 * Algo-025 `validasiJadwal` (Q-019, Q-020), then `JadwalKonsultasi.simpanJadwal()`.
 *
 *  - 422 time not ISO 8601, end not after start, or consultant not registered
 *  - 409 overlaps another slot of the consultant
 *  - 500 `GAGAL_MENYIMPAN_JADWAL` the database could not store it (UC-05 alternative 2)
 */
slotRoutes.post("/", auth, requireRole("administrator"), async (c) => {
  const body = await bacaBody(c);
  const idKonsultan = body.idKonsultan;
  if (typeof idKonsultan !== "string" || idKonsultan.trim().length === 0) {
    throw gagalValidasi("idKonsultan wajib diisi");
  }
  const db = c.get("db");

  const hasil = await periksaJadwal(db, {
    idKonsultan,
    waktu: body.waktu,
    waktuSelesai: body.waktuSelesai,
  });
  if (!hasil.valid) throw tolakJadwal(hasil.alasan, hasil.pesan);

  let idJadwal: string | null;
  try {
    idJadwal = await simpanJadwal(db, {
      idKonsultan,
      waktu: hasil.mulai.toISOString(),
      waktuSelesai: hasil.selesai.toISOString(),
    });
  } catch (error) {
    console.error("[simpanJadwal]", error);
    throw gagalSimpanJadwal();
  }
  // Lost a race with another administrator: the slot now overlaps one that was just saved.
  if (idJadwal === null) throw bentrokJadwal("Slot bertumpang tindih dengan jadwal konsultan lain");

  return c.json({ ok: true, idJadwal }, 201);
});

/**
 * UC-05 — Algo-022 administrator branch: Algo-025 `validasiJadwal`, then
 * `KalenderGabungan.ubahKalender` -> Algo-029 Q-027 (`JadwalKonsultasi.perbaruiJadwal()`).
 * Same status codes as POST; an unknown slot is 404.
 */
slotRoutes.patch("/:id", auth, requireRole("administrator"), async (c) => {
  const idJadwal = c.req.param("id");
  const body = await bacaBody(c);
  const db = c.get("db");

  const [slot] = await ambilSlot(db, idJadwal);
  if (!slot) throw tidakDitemukan("Slot jadwal tidak ditemukan");

  const hasil = await periksaJadwal(db, {
    idJadwal,
    idKonsultan: slot.idKonsultan,
    waktu: body.waktu ?? slot.waktu,
    waktuSelesai: body.waktuSelesai ?? slot.waktuSelesai,
  });
  if (!hasil.valid) throw tolakJadwal(hasil.alasan, hasil.pesan);

  let tersimpan: boolean;
  try {
    tersimpan = await perbaruiJadwal(db, {
      idJadwal, // Q-027
      waktu: hasil.mulai.toISOString(),
      waktuSelesai: hasil.selesai.toISOString(),
    });
  } catch (error) {
    console.error("[perbaruiJadwal]", error);
    throw gagalSimpanJadwal();
  }
  if (!tersimpan) throw bentrokJadwal("Slot bertumpang tindih dengan jadwal konsultan lain");

  return c.json({ ok: true, idJadwal });
});
