/**
 * Health reminders (DPPL C-27 `ReminderController`, Algo-006).
 *
 * The backend always returns the three `jenis`; `waktu` is `null` while that
 * reminder is off.
 */
import { api } from './client';

/** The three reminder types from `JENIS_REMINDER` (C-06 `Reminder.jenis`). */
export type JenisPengingat = 'makan' | 'tidur' | 'olahraga';

export type Pengingat = {
  jenis: JenisPengingat;
  /** Daily send time, "HH:MM", or `null` when the reminder is off. */
  waktu: string | null;
};

/** `tampilkanOpsiReminder()`: all three reminders, with `waktu: null` when unset. */
export async function ambilPengingat(): Promise<Pengingat[]> {
  const { reminders } = await api.get<{ reminders: Pengingat[] }>('/api/reminders');
  return reminders;
}

/**
 * `submitWaktuPengiriman(waktu)` per `jenis`: Algo-023 `validasiWaktu`, then
 * `Reminder.aturWaktuKirim` (Algo-006). Creates the row on the first save.
 */
export async function simpanPengingat(jenis: JenisPengingat, waktu: string): Promise<void> {
  await api.put(`/api/reminders/${jenis}`, { waktu });
}

/**
 * I-05-05 toggle off: stops that reminder by deleting its row. Toggling back
 * on goes through `simpanPengingat` again.
 */
export async function hapusPengingat(jenis: JenisPengingat): Promise<void> {
  await api.delete(`/api/reminders/${jenis}`);
}
