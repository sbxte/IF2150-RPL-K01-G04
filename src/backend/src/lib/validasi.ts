import { konsultanAda, slotKonsultanTumpang, type Db } from "../db/queries";

/**
 * Validation predicates for class `Validasi` (C-33).
 * Source: Algo-023..Algo-026.
 */

export const POLA_WAKTU = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
export const POLA_EXPO_TOKEN = /^Expo(nent)?PushToken\[.+\]$/;

/** Algo-023: `validasiWaktu` — "HH:MM". */
export function validasiWaktu(waktu: unknown): waktu is string {
  return typeof waktu === "string" && POLA_WAKTU.test(waktu);
}

/** Algo-026: `validasiInput` — every required string is non-empty and not whitespace-only. */
export function validasiInput(isi: (unknown)[]): boolean {
  return isi.every(
    (teks) => typeof teks === "string" && teks.trim().length > 0,
  );
}

/** Algo-003 device token shape check, part of `daftarkanPerangkat`. */
export function validasiTokenPush(tokenPush: unknown): tokenPush is string {
  return typeof tokenPush === "string" && POLA_EXPO_TOKEN.test(tokenPush);
}

/** Shared ISO-8601 date-time parse; used by `validasiJadwal` (Algo-025). */
export function parseIso8601(nilai: unknown): Date | null {
  if (typeof nilai !== "string" || nilai.trim().length === 0) return null;
  const waktu = new Date(nilai);
  if (Number.isNaN(waktu.getTime())) return null;
  // Require a full timestamp (T separator) so bare dates are rejected.
  if (!/T\d{2}:\d{2}/.test(nilai)) return null;
  return waktu;
}

/**
 * Algo-025 `validasiJadwal`, minus the database checks that need the request context.
 * Returns the parsed bounds when the window is well-formed.
 */
export function validasiRentangJadwal(
  waktu: unknown,
  waktuSelesai: unknown,
): { mulai: Date; selesai: Date } | null {
  const mulai = parseIso8601(waktu);
  const selesai = parseIso8601(waktuSelesai);
  if (!mulai || !selesai) return null;
  if (selesai.getTime() <= mulai.getTime()) return null;
  return { mulai, selesai };
}

/** Escapes LIKE wildcards with `!` per Algo-017. */
export function escapeLikePattern(kataKunci: string): string {
  return kataKunci.replace(/[!%_]/g, (ch) => `!${ch}`);
}

/* -------------------------------------------------------------------------- */
/* Algo-025 — validasiJadwal (UC-05)                                          */
/* -------------------------------------------------------------------------- */

/** The slot an administrator wants to save. `idJadwal` is omitted for a new slot. */
export interface JadwalMasuk {
  idJadwal?: string;
  idKonsultan: unknown;
  waktu: unknown;
  waktuSelesai: unknown;
}

export type AlasanJadwalDitolak =
  /** `waktu` or `waktuSelesai` is not a valid ISO 8601 date-time. */
  | "FORMAT_WAKTU"
  /** `waktuSelesai` is not after `waktu`. */
  | "URUTAN_WAKTU"
  /** The consultant is not registered (Algo-024, Q-019). */
  | "KONSULTAN_TIDAK_TERDAFTAR"
  /** The slot overlaps another slot of the same consultant (Q-020). */
  | "TUMPANG_TINDIH";

export type HasilValidasiJadwal =
  | { valid: true; mulai: Date; selesai: Date }
  | { valid: false; alasan: AlasanJadwalDitolak; pesan: string };

const PESAN_DITOLAK: Record<AlasanJadwalDitolak, string> = {
  FORMAT_WAKTU: "waktu dan waktuSelesai harus berupa waktu ISO 8601 yang valid",
  URUTAN_WAKTU: "Waktu selesai harus setelah waktu mulai",
  KONSULTAN_TIDAK_TERDAFTAR: "Konsultan tidak terdaftar",
  TUMPANG_TINDIH: "Slot bertumpang tindih dengan jadwal konsultan lain",
};

/**
 * Algo-025 `validasiJadwal`, with the reason for a rejection kept so the controller
 * can answer 422 (bad input) or 409 (overlap) and the screen can say what is wrong.
 *
 *  1. both times are valid ISO 8601
 *  2. `waktuSelesai` is after `waktu`
 *  3. the consultant is registered (`validasiKonsultan`, Q-019)
 *  4. no other slot of the consultant overlaps (Q-020), ignoring the slot itself on an edit
 *
 * Checks run in that order, so a malformed request never reaches the database.
 */
export async function periksaJadwal(
  db: Db,
  jadwal: JadwalMasuk,
): Promise<HasilValidasiJadwal> {
  const tolak = (alasan: AlasanJadwalDitolak): HasilValidasiJadwal => ({
    valid: false,
    alasan,
    pesan: PESAN_DITOLAK[alasan],
  });

  const mulai = parseIso8601(jadwal.waktu);
  const selesai = parseIso8601(jadwal.waktuSelesai);
  if (!mulai || !selesai) return tolak("FORMAT_WAKTU");
  if (selesai.getTime() <= mulai.getTime()) return tolak("URUTAN_WAKTU");

  const idKonsultan = jadwal.idKonsultan;
  if (typeof idKonsultan !== "string" || idKonsultan.trim().length === 0) {
    return tolak("KONSULTAN_TIDAK_TERDAFTAR");
  }
  const [ada] = await konsultanAda(db, idKonsultan); // Q-019
  if (!ada) return tolak("KONSULTAN_TIDAK_TERDAFTAR");

  const [tumpang] = await slotKonsultanTumpang(db, {
    idKonsultan, // Q-020
    idJadwal: jadwal.idJadwal ?? "",
    waktu: mulai.toISOString(),
    waktuSelesai: selesai.toISOString(),
  });
  if (tumpang) return tolak("TUMPANG_TINDIH");

  return { valid: true, mulai, selesai };
}

/** Algo-025 `validasiJadwal(jadwal): Boolean`. */
export async function validasiJadwal(db: Db, jadwal: JadwalMasuk): Promise<boolean> {
  return (await periksaJadwal(db, jadwal)).valid;
}
