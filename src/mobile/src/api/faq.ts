/**
 * FAQ and question-submission API (issue #10, UC-06/UC-07/UC-12).
 *
 * Mirrors `FAQController` (C-30) and `PengajuanPertanyaan` (C-13) on the
 * backend, which already implements Algo-017 (search), Algo-026 (input
 * validation) and Algo-030 with Q-015/Q-035/Q-036/Q-037/Q-040. The
 * administrator view of submissions is an addition (M9 B.1 no. 9).
 */
import { api } from './client';

/** A `faq` row (C-12 `FAQ`). */
export type Faq = {
  idFaq: string;
  pertanyaan: string;
  jawaban: string;
};

/**
 * `FAQController.tampilkanFAQ()` / `cariFAQ(kataKunci)` — Algo-017.
 * A blank keyword lists every FAQ (the route treats it the same as no `?q=`).
 */
export async function ambilFaq(kataKunci?: string): Promise<Faq[]> {
  const kunci = kataKunci?.trim();
  const jalur = kunci ? `/api/faq?q=${encodeURIComponent(kunci)}` : '/api/faq';
  const respons = await api.get<{ faq: Faq[] }>(jalur);
  return respons.faq;
}

/** `FAQController.tambahFAQ(pertanyaan, jawaban)` — Q-035. Administrator only. */
export function tambahFaq(data: { pertanyaan: string; jawaban: string }) {
  return api.post<{ ok: true; idFaq: string }>('/api/faq', data);
}

/** `FAQController.ubahFAQ(idFAQ, pertanyaan, jawaban)` — Q-036. Administrator only. */
export function ubahFaq(idFaq: string, data: { pertanyaan: string; jawaban: string }) {
  return api.put<{ ok: true; idFaq: string }>(`/api/faq/${encodeURIComponent(idFaq)}`, data);
}

/** `FAQController.hapusFAQ(idFAQ)` — Q-037. Administrator only. */
export function hapusFaq(idFaq: string) {
  return api.delete<{ ok: true; idFaq: string }>(`/api/faq/${encodeURIComponent(idFaq)}`);
}

/** `FAQController.kirimPertanyaan(isi)` — Q-040. Mahasiswa only. */
export function ajukanPertanyaan(isi: string) {
  return api.post<{ ok: true; idPertanyaan: string }>('/api/questions', { isi });
}

/** A `pengajuan_pertanyaan` row plus the student's name (C-13, admin view). */
export type Pertanyaan = {
  idPertanyaan: string;
  isiPertanyaan: string;
  nama: string;
  /** NULL for rows stored before the column existed. */
  waktuPengajuan: string | null;
};

/** Administrator — submitted questions, newest first (M9 B.1 no. 9). */
export async function ambilPertanyaan(): Promise<Pertanyaan[]> {
  const respons = await api.get<{ pertanyaan: Pertanyaan[] }>('/api/questions');
  return respons.pertanyaan;
}

/** Administrator — delete a submitted question (M9 B.1 no. 9). */
export function hapusPertanyaan(idPertanyaan: string) {
  return api.delete<{ ok: true; idPertanyaan: string }>(
    `/api/questions/${encodeURIComponent(idPertanyaan)}`,
  );
}
