/**
 * FAQ and question-submission API (issue #10, UC-06/UC-07/UC-12).
 *
 * Mirrors `FAQController` (C-30) and `PengajuanPertanyaan` (C-13) on the
 * backend, which already implements Algo-017 (search), Algo-026 (input
 * validation) and Algo-030 with Q-015/Q-035/Q-036/Q-037/Q-040. The
 * administrator view of submissions is an addition (M9 B.1 no. 11).
 */
import { api } from './client';

/** A `faq` row (C-12 `FAQ`). */
export type Faq = {
  idFaq: string;
  pertanyaan: string;
  jawaban: string;
};

/** Sort order for the administrator FAQ list (M9 B.1 no. 12). */
export type UrutFaq = 'az' | 'za' | 'baru';

/**
 * `FAQController.tampilkanFAQ()` / `cariFAQ(kataKunci)` — Algo-017.
 * A blank keyword lists every FAQ (the route treats it the same as no `?q=`).
 * `urut` is an addition from M9 B.1 no. 12; the default A–Z is left implicit.
 */
export async function ambilFaq(opsi: { q?: string; urut?: UrutFaq } = {}): Promise<Faq[]> {
  const parameter = new URLSearchParams();
  const kunci = opsi.q?.trim();
  if (kunci) parameter.set('q', kunci);
  if (opsi.urut && opsi.urut !== 'az') parameter.set('urut', opsi.urut);
  const kueri = parameter.toString();
  const respons = await api.get<{ faq: Faq[] }>(kueri ? `/api/faq?${kueri}` : '/api/faq');
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

/**
 * Administrator — submitted questions, newest first (M9 B.1 no. 11).
 * `q` matches the question text or the student's name; `sejak`/`sampai` are
 * ISO timestamps bounding `waktu_pengajuan`.
 */
export async function ambilPertanyaan(
  opsi: { q?: string; sejak?: string; sampai?: string } = {},
): Promise<Pertanyaan[]> {
  const parameter = new URLSearchParams();
  const kunci = opsi.q?.trim();
  if (kunci) parameter.set('q', kunci);
  if (opsi.sejak) parameter.set('sejak', opsi.sejak);
  if (opsi.sampai) parameter.set('sampai', opsi.sampai);
  const kueri = parameter.toString();
  const respons = await api.get<{ pertanyaan: Pertanyaan[] }>(
    kueri ? `/api/questions?${kueri}` : '/api/questions',
  );
  return respons.pertanyaan;
}

/** Administrator — delete a submitted question (M9 B.1 no. 11). */
export function hapusPertanyaan(idPertanyaan: string) {
  return api.delete<{ ok: true; idPertanyaan: string }>(
    `/api/questions/${encodeURIComponent(idPertanyaan)}`,
  );
}
