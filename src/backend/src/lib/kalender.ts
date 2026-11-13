import type { EventGoogle } from "./google";

export interface EventKalender {
  judul: string;
  mulai: string;
  selesai: string;
  /** `google`, `terpesan` (a session the student booked), or `tersedia` (a slot still open). */
  sumber: "google" | "tersedia" | "terpesan" | string;
  /** Consultation entries only. */
  idJadwal?: string;
  konsultan?: string;
  spesialisasi?: string;
  /** True only for the viewing student's own booked session. */
  milikSaya?: boolean;
}


/**
 * Chronological order for calendar entries.
 *
 * `Date.parse` alone misorders all-day events: an all-day value is `YYYY-MM-DD`
 * and parses as UTC midnight, while a timed event carries its own offset. A
 * 09:00 WIB event on the same date is 02:00 UTC, so it would sort *before* the
 * all-day entry it shares a day with. A date-only value is therefore treated as
 * the start of that day in local time, matching how the app renders it.
 */
export function bandingkanMulai(a: string, b: string): number {
  const selisih = wakilMulai(a) - wakilMulai(b);
  // Two unparseable values both map to Infinity, and Infinity - Infinity is NaN,
  // which would make the comparator inconsistent.
  return Number.isFinite(selisih) ? selisih : 0;
}

/** Milliseconds for comparison; date-only values anchor to local midnight. */
function wakilMulai(nilai: string): number {
  const hanyaTanggal = /^\d{4}-\d{2}-\d{2}$/.test(nilai);
  if (hanyaTanggal) {
    const [t, b, h] = nilai.split("-").map(Number);
    return new Date(t, b - 1, h).getTime();
  }
  const waktu = Date.parse(nilai);
  return Number.isFinite(waktu) ? waktu : Number.POSITIVE_INFINITY;
}

/** A slot from Q-013 with its consultant, as `gabungkanJadwal` needs it. */
export interface JadwalKalender {
  idJadwal: string;
  namaKonsultan: string;
  spesialisasi: string;
  waktu: string;
  waktuSelesai: string;
  status: string;
  idMahasiswa: string | null;
}

/**
 * Calendar day of a slot, `YYYY-MM-DD`. Deliberately the same rule as the
 * booking checks in `routes/consultation.ts` (`slice(0, 10)` / `substr(waktu, 1, 10)`),
 * so the calendar never offers a slot that `POST /api/slots/:id/book` rejects
 * as "already has a session that day".
 */
export function tanggalSlot(waktu: string): string {
  return waktu.slice(0, 10);
}

/**
 * KalenderGabungan.gabungkanJadwal — Algo-011, per student (issue #11).
 *
 *  - The student's own booked sessions are always shown, with the consultant's
 *    name and `milikSaya: true`.
 *  - Sessions booked by other students are never shown.
 *  - An open slot is shown with its consultant's name, unless it is already in
 *    the past, overlaps one of the student's own sessions, or falls on a day
 *    where the student already has a session (offering another is redundant,
 *    and booking it would be refused).
 *  - Google events are always shown and never hide a slot: Google Calendar is
 *    advisory and the student may still book over it after confirming.
 */
export function gabungkanJadwal(
  google: EventGoogle[],
  jadwal: JadwalKalender[],
  idMahasiswa: string,
  sekarang: Date = new Date(),
): EventKalender[] {
  const hasil: EventKalender[] = [];
  for (const event of google) {
    const mulai = event.start?.dateTime ?? event.start?.date;
    const selesai = event.end?.dateTime ?? event.end?.date;
    if (!mulai || !selesai) continue;
    hasil.push({
      judul: event.summary?.trim() || "(tanpa judul)",
      mulai,
      selesai,
      sumber: "google",
    });
  }

  const sesiSaya = jadwal.filter((j) => j.status === "terpesan" && j.idMahasiswa === idMahasiswa);
  const hariBerSesi = new Set(sesiSaya.map((j) => tanggalSlot(j.waktu)));

  for (const j of sesiSaya) {
    hasil.push({
      judul: "Sesi konsultasi saya",
      mulai: j.waktu,
      selesai: j.waktuSelesai,
      sumber: "terpesan",
      idJadwal: j.idJadwal,
      konsultan: j.namaKonsultan,
      spesialisasi: j.spesialisasi,
      milikSaya: true,
    });
  }

  for (const j of jadwal) {
    if (j.status !== "tersedia") continue;
    if (Date.parse(j.waktu) < sekarang.getTime()) continue;
    if (hariBerSesi.has(tanggalSlot(j.waktu))) continue;
    const tumpang = sesiSaya.some((s) => j.waktu < s.waktuSelesai && j.waktuSelesai > s.waktu);
    if (tumpang) continue;

    hasil.push({
      judul: "Slot konsultasi tersedia",
      mulai: j.waktu,
      selesai: j.waktuSelesai,
      sumber: "tersedia",
      idJadwal: j.idJadwal,
      konsultan: j.namaKonsultan,
      spesialisasi: j.spesialisasi,
      milikSaya: false,
    });
  }

  return hasil.sort((a, b) => bandingkanMulai(a.mulai, b.mulai));
}
