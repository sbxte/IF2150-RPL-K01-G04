/**
 * Feedback and administrator responses (issue #15, UC-08/UC-09).
 *
 * Mirrors `FeedbackController` (C-31) and `UmpanBalik` (C-14) on the backend,
 * which implements Algo-018 / Algo-019 with Q-016, Q-038 and Q-039. The
 * student's own list (Q-043) and the status filter behind I-14-02's chips are
 * additions recorded in M9 B.1.
 */
import { api } from './client';

/** One `umpan_balik` row as the administrator sees it (Q-016). */
export type UmpanBalikAdmin = {
  idUmpanBalik: string;
  /** Sender's name; only the administrator list carries it. */
  namaMahasiswa: string;
  isi: string;
  /** `null` until an administrator answers (I-14-03 badge). */
  tanggapan: string | null;
};

/** One `umpan_balik` row as its author sees it (Q-043, I-11-06). */
export type UmpanBalikSaya = {
  idUmpanBalik: string;
  isi: string;
  tanggapan: string | null;
  /** `null` until answered; lets I-11-06 show the answered state. */
  idAdministrator: string | null;
};

/** I-14-02's filter chips: all, not yet answered, answered. */
export type StatusUmpanBalik = 'belum' | 'sudah';

/** `FeedbackController.kirimFeedback(isi)` — Q-038. Mahasiswa only. */
export function kirimUmpanBalik(isi: string) {
  return api.post<{ ok: true; idUmpanBalik: string }>('/api/feedback', { isi });
}

/**
 * `FeedbackController.ambilListUmpanBalik()` for the author — Q-043, newest first.
 * Separate from the administrator list so a student can never read anyone
 * else's feedback.
 */
export async function ambilUmpanBalikSaya(): Promise<UmpanBalikSaya[]> {
  const { feedback } = await api.get<{ feedback: UmpanBalikSaya[] }>('/api/feedback/mine');
  return feedback;
}

/**
 * `FeedbackController.tampilkanListFeedback()` — Q-016. Administrator only.
 * `status` is left out when undefined so the request matches "Semua".
 */
export async function ambilUmpanBalik(
  opsi: { status?: StatusUmpanBalik } = {},
): Promise<UmpanBalikAdmin[]> {
  const kueri = opsi.status ? `?status=${opsi.status}` : '';
  const { feedback } = await api.get<{ feedback: UmpanBalikAdmin[] }>(`/api/feedback${kueri}`);
  return feedback;
}

/**
 * `FeedbackController.kirimTanggapan(tanggapan)` — Q-039. Administrator only.
 * The backend stamps `id_administrator` from the session, so it is not sent.
 */
export function tanggapiUmpanBalik(idUmpanBalik: string, tanggapan: string) {
  return api.put<{ ok: true; idUmpanBalik: string }>(
    `/api/feedback/${encodeURIComponent(idUmpanBalik)}/response`,
    { tanggapan },
  );
}
