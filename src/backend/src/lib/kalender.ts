import type { EventGoogle } from "./google";

export interface EventKalender {
  judul: string;
  mulai: string;
  selesai: string;
  sumber: "google" | "tersedia" | "terpesan" | string;
}

/** KalenderGabungan.gabungkanJadwal — Algo-011. */
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

export function gabungkanJadwal(
  google: EventGoogle[],
  jadwal: { waktu: string; waktuSelesai: string; status: string }[],
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
  for (const slot of jadwal) {
    hasil.push({
      judul: "Sesi konsultasi",
      mulai: slot.waktu,
      selesai: slot.waktuSelesai,
      sumber: slot.status,
    });
  }
  return hasil.sort((a, b) => bandingkanMulai(a.mulai, b.mulai));
}
