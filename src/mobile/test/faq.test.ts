import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// Imported from the module itself, not the `@/api` barrel: the barrel also exports
// the session modules, which pull in Expo native modules that cannot load in Node.
import { ajukanPertanyaan, ambilFaq, hapusFaq, tambahFaq, ubahFaq } from '@/api/faq';

const URL_API = 'http://sehati.test';

/** Replaces `fetch` with a mock that answers `status` with `isi` (a JSON value). */
function tiruFetch(status: number, isi?: unknown) {
  const teks = isi === undefined ? '' : JSON.stringify(isi);
  const fetchTiruan = vi.fn(async () => new Response(teks || null, { status }));
  vi.stubGlobal('fetch', fetchTiruan);
  return fetchTiruan;
}

/** The URL and options of the n-th `fetch` call. */
function panggilan(fetchTiruan: ReturnType<typeof tiruFetch>, n = 0) {
  const [url, opsi] = fetchTiruan.mock.calls[n] as unknown as [string, RequestInit];
  return { url, opsi, header: opsi.headers as Record<string, string> };
}

beforeEach(() => {
  vi.stubEnv('EXPO_PUBLIC_API_URL', URL_API);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('ambilFaq', () => {
  test('tanpa kata kunci meminta /api/faq tanpa ?q=', async () => {
    const fetchTiruan = tiruFetch(200, { faq: [] });

    await ambilFaq();

    expect(panggilan(fetchTiruan).url).toBe(`${URL_API}/api/faq`);
  });

  test('kata kunci kosong diperlakukan seperti tanpa pencarian (Algo-017)', async () => {
    const fetchTiruan = tiruFetch(200, { faq: [] });

    await ambilFaq('   ');

    expect(panggilan(fetchTiruan).url).toBe(`${URL_API}/api/faq`);
  });

  test('kata kunci dikodekan pada ?q= dan hasil amplop diurai', async () => {
    const daftar = [{ idFaq: 'faq-1', pertanyaan: 'Apa itu?', jawaban: 'Ini.' }];
    const fetchTiruan = tiruFetch(200, { faq: daftar });

    await expect(ambilFaq('cara 100%?')).resolves.toEqual(daftar);

    expect(panggilan(fetchTiruan).url).toBe(`${URL_API}/api/faq?q=cara%20100%25%3F`);
    expect(panggilan(fetchTiruan).opsi.method).toBe('GET');
  });
});

describe('tambahFaq dan ubahFaq', () => {
  test('tambahFaq mengirim POST dengan pasangan pertanyaan-jawaban (Q-035)', async () => {
    const fetchTiruan = tiruFetch(201, { ok: true, idFaq: 'faq-9' });

    await expect(tambahFaq({ pertanyaan: 'Baru?', jawaban: 'Ini.' })).resolves.toEqual({
      ok: true,
      idFaq: 'faq-9',
    });

    const { url, opsi, header } = panggilan(fetchTiruan);
    expect(url).toBe(`${URL_API}/api/faq`);
    expect(opsi.method).toBe('POST');
    expect(header['Content-Type']).toBe('application/json');
    expect(opsi.body).toBe('{"pertanyaan":"Baru?","jawaban":"Ini."}');
  });

  test('ubahFaq mengirim PUT ke /api/faq/:id dengan isi baru (Q-036)', async () => {
    const fetchTiruan = tiruFetch(200, { ok: true, idFaq: 'faq 1' });

    await ubahFaq('faq 1', { pertanyaan: 'Diubah?', jawaban: 'Begitu.' });

    const { url, opsi, header } = panggilan(fetchTiruan);
    expect(url).toBe(`${URL_API}/api/faq/faq%201`);
    expect(opsi.method).toBe('PUT');
    expect(header['Content-Type']).toBe('application/json');
    expect(opsi.body).toBe('{"pertanyaan":"Diubah?","jawaban":"Begitu."}');
  });
});

describe('hapusFaq', () => {
  test('mengirim DELETE ke /api/faq/:id tanpa isi (Q-037)', async () => {
    const fetchTiruan = tiruFetch(200, { ok: true, idFaq: 'faq-1' });

    await expect(hapusFaq('faq-1')).resolves.toEqual({ ok: true, idFaq: 'faq-1' });

    const { url, opsi } = panggilan(fetchTiruan);
    expect(url).toBe(`${URL_API}/api/faq/faq-1`);
    expect(opsi.method).toBe('DELETE');
    expect(opsi.body).toBeUndefined();
  });
});

describe('ajukanPertanyaan', () => {
  test('mengirim POST /api/questions dengan { isi } (Q-040)', async () => {
    const fetchTiruan = tiruFetch(201, { ok: true, idPertanyaan: 't-1' });

    await expect(ajukanPertanyaan('Kenapa ya?')).resolves.toEqual({ ok: true, idPertanyaan: 't-1' });

    const { url, opsi, header } = panggilan(fetchTiruan);
    expect(url).toBe(`${URL_API}/api/questions`);
    expect(opsi.method).toBe('POST');
    expect(header['Content-Type']).toBe('application/json');
    expect(opsi.body).toBe('{"isi":"Kenapa ya?"}');
  });
});
