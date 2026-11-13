import { randomUUID } from "node:crypto";
import type { Db } from "../db/queries";

/**
 * `JadwalKonsultasi` (C-11) — the write side of UC-05.
 *
 * `Validasi.validasiJadwal` (Algo-025) runs first and gives a clear reason when a slot
 * is rejected. These writes repeat the overlap test inside the statement itself
 * (`WHERE NOT EXISTS ...`): D1 runs the validation query and the write as separate
 * statements, so two administrators saving at the same moment could otherwise both pass
 * validation and then both write. The write returns `false` when it loses that race.
 *
 * Stored times are compared through `strftime` for the same reason as Q-020 in
 * `db/queries.ts`: rows written by the seed have no milliseconds, rows written by the
 * API do.
 */

const NORMAL = "'%Y-%m-%dT%H:%M:%fZ'";

export interface SlotBaru {
  idKonsultan: string;
  /** ISO 8601, already validated and canonical (`Date#toISOString`). */
  waktu: string;
  waktuSelesai: string;
}

export interface SlotUbah {
  idJadwal: string;
  waktu: string;
  waktuSelesai: string;
}

/**
 * `simpanJadwal()` — saves a new, available slot (I-12-09 "Tambah Slot").
 * Returns the new `idJadwal`, or `null` when another slot of the consultant now overlaps it.
 */
export async function simpanJadwal(db: Db, slot: SlotBaru): Promise<string | null> {
  const idJadwal = randomUUID();
  const hasil = await db.$client
    .prepare(
      `INSERT INTO jadwal_konsultasi (id_jadwal, id_konsultan, waktu, waktu_selesai, status)
       SELECT ?, ?, ?, ?, 'tersedia'
       WHERE NOT EXISTS (
         SELECT 1 FROM jadwal_konsultasi
         WHERE id_konsultan = ? AND id_jadwal <> ?
           AND strftime(${NORMAL}, waktu) < ?
           AND strftime(${NORMAL}, waktu_selesai) > ?
       )`,
    )
    .bind(
      idJadwal, slot.idKonsultan, slot.waktu, slot.waktuSelesai,
      slot.idKonsultan, idJadwal, slot.waktuSelesai, slot.waktu,
    )
    .run();
  return (hasil.meta?.changes ?? 0) === 1 ? idJadwal : null;
}

/**
 * `perbaruiJadwal()` — Q-027, changes the start and end of an existing slot (I-12-05/06).
 * Returns `false` when another slot of the same consultant now overlaps the new window.
 */
export async function perbaruiJadwal(db: Db, slot: SlotUbah): Promise<boolean> {
  const hasil = await db.$client
    .prepare(
      `UPDATE jadwal_konsultasi SET waktu = ?, waktu_selesai = ?
       WHERE id_jadwal = ?
         AND NOT EXISTS (
           SELECT 1 FROM jadwal_konsultasi o
           WHERE o.id_konsultan = jadwal_konsultasi.id_konsultan
             AND o.id_jadwal <> jadwal_konsultasi.id_jadwal
             AND strftime(${NORMAL}, o.waktu) < ?
             AND strftime(${NORMAL}, o.waktu_selesai) > ?
         )`,
    )
    .bind(slot.waktu, slot.waktuSelesai, slot.idJadwal, slot.waktuSelesai, slot.waktu)
    .run();
  return (hasil.meta?.changes ?? 0) === 1;
}
