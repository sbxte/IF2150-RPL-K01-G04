/**
 * Helpers for I-12 Kelola Jadwal Konsultan (UC-05): dates and times in WIB, the
 * client-side check that mirrors `Validasi.validasiJadwal` (Algo-025), and how a failed
 * request is told apart. The server stays the authority; this check only saves a round trip.
 */
import { ApiError } from '@/api/client';

const WIB_MS = 7 * 3_600_000;

/** I-12-03: the screen offers this many date chips, starting today. */
export const JUMLAH_HARI = 3;

/** I-12-08, UC-05 alternative 1: the schedule data could not be loaded. */
export const PESAN_GAGAL_MUAT = 'Gagal mengambil data jadwal konsultasi. Tekan Muat ulang untuk mencoba lagi.';
/** I-12-07, UC-05 alternative 2: the change could not be saved. */
export const PESAN_GAGAL_SIMPAN = 'Perubahan jadwal gagal disimpan. Tekan Simpan sekali lagi.';

export const PESAN_FORMAT_JAM = 'Isi jam dengan format JJ.MM, misalnya 09.00.';
export const PESAN_URUTAN_JAM = 'Jam selesai harus setelah jam mulai.';

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/** `YYYY-MM-DD` of an instant, on the calendar in WIB. */
export function tanggalWib(instan: Date | string | number): string {
  return new Date(new Date(instan).getTime() + WIB_MS).toISOString().slice(0, 10);
}

/** The next `jumlah` WIB dates, starting with today. */
export function daftarTanggal(sekarang: Date = new Date(), jumlah: number = JUMLAH_HARI): string[] {
  const hariIni = Date.parse(`${tanggalWib(sekarang)}T00:00:00Z`);
  return Array.from({ length: jumlah }, (_, i) => new Date(hariIni + i * 86_400_000).toISOString().slice(0, 10));
}

/** "Kam, 30 Okt" for `2026-10-30`. */
export function labelTanggal(tanggal: string): string {
  const d = new Date(`${tanggal}T00:00:00Z`);
  return `${HARI[d.getUTCDay()]}, ${d.getUTCDate()} ${BULAN[d.getUTCMonth()]}`;
}

/** "09.00" for an ISO instant, in WIB. */
export function jamWib(iso: string): string {
  return new Date(Date.parse(iso) + WIB_MS).toISOString().slice(11, 16).replace(':', '.');
}

/** "09.00–10.00" */
export function rentangJamWib(mulai: string, selesai: string): string {
  return `${jamWib(mulai)}–${jamWib(selesai)}`;
}

/** Reads "9.00", "09.00", "9:00" or "09:00" as `HH:MM`; anything else is `null`. */
export function parseJam(teks: string): string | null {
  const cocok = /^\s*(\d{1,2})[.:](\d{2})\s*$/.exec(teks);
  if (!cocok) return null;
  const jam = Number(cocok[1]);
  const menit = Number(cocok[2]);
  if (jam > 23 || menit > 59) return null;
  return `${String(jam).padStart(2, '0')}:${String(menit).padStart(2, '0')}`;
}

/** ISO instant (UTC) for `HH:MM` WIB on a WIB date. */
export function jamKeIso(tanggal: string, hhmm: string): string {
  return new Date(`${tanggal}T${hhmm}:00+07:00`).toISOString();
}

export type SlotJadwal = { idJadwal: string; waktu: string; waktuSelesai: string };

/** Messages for the panel: one per field, plus one for the panel as a whole. */
export type GalatForm = { mulai?: string; selesai?: string; umum?: string };

export type HasilForm =
  | { ok: true; waktu: string; waktuSelesai: string }
  | { ok: false; galat: GalatForm };

/**
 * Checks what the administrator typed before it is sent (Algo-025, minus the consultant
 * lookup): both times are valid, the end is after the start, and no other slot of the
 * consultant overlaps. `idDiedit` leaves the slot being edited out of the overlap test.
 */
export function validasiFormJadwal(
  tanggal: string,
  mulaiTeks: string,
  selesaiTeks: string,
  slotLain: SlotJadwal[],
  idDiedit?: string,
): HasilForm {
  const mulai = parseJam(mulaiTeks);
  const selesai = parseJam(selesaiTeks);
  if (!mulai || !selesai) {
    return {
      ok: false,
      galat: {
        ...(!mulai && { mulai: PESAN_FORMAT_JAM }),
        ...(!selesai && { selesai: PESAN_FORMAT_JAM }),
      },
    };
  }

  const waktu = jamKeIso(tanggal, mulai);
  const waktuSelesai = jamKeIso(tanggal, selesai);
  if (Date.parse(waktuSelesai) <= Date.parse(waktu)) {
    return { ok: false, galat: { selesai: PESAN_URUTAN_JAM } };
  }

  const bentrok = slotLain.find(
    (s) =>
      s.idJadwal !== idDiedit &&
      Date.parse(s.waktu) < Date.parse(waktuSelesai) &&
      Date.parse(s.waktuSelesai) > Date.parse(waktu),
  );
  if (bentrok) {
    return {
      ok: false,
      galat: {
        umum: `Jam ini bertumpang tindih dengan slot ${rentangJamWib(bentrok.waktu, bentrok.waktuSelesai)}. Ubah jam mulai atau selesai.`,
      },
    };
  }

  return { ok: true, waktu, waktuSelesai };
}

export type GalatSimpan =
  /** The server refused the input (overlap, bad times, slot gone): tell the administrator what to change. */
  | { jenis: 'ditolak'; pesan: string }
  /** The change could not be stored, or the server could not be reached: the I-12-07 banner. */
  | { jenis: 'gagal' };

/** Tells a refused change (400/404/409/422) from a failed one (anything else, including no response). */
export function klasifikasiGalatSimpan(galat: unknown): GalatSimpan {
  if (galat instanceof ApiError && [400, 404, 409, 422].includes(galat.status)) {
    return { jenis: 'ditolak', pesan: galat.pesan };
  }
  return { jenis: 'gagal' };
}
