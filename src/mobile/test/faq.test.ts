import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// Imported from the module itself, not the `@/api` barrel: the barrel also exports
// the session modules, which pull in Expo native modules that cannot load in Node.
import {
  ajukanPertanyaan,
  ambilFaq,
  ambilPertanyaan,
  hapusFaq,
  hapusPertanyaan,
  tambahFaq,
  ubahFaq,
} from '@/api/faq';

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

    await ambilFaq({ q: '   ' });

    expect(panggilan(fetchTiruan).url).toBe(`${URL_API}/api/faq`);
  });

  test('kata kunci dikodekan pada ?q= dan hasil amplop diurai', async () => {
    const daftar = [{ idFaq: 'faq-1', pertanyaan: 'Apa itu?', jawaban: 'Ini.' }];
    const fetchTiruan = tiruFetch(200, { faq: daftar });

    await expect(ambilFaq({ q: 'cara 100%?' })).resolves.toEqual(daftar);

    expect(panggilan(fetchTiruan).url).toBe(`${URL_API}/api/faq?q=cara+100%25%3F`);
    expect(panggilan(fetchTiruan).opsi.method).toBe('GET');
  });

  test('urutan selain A–Z dikirim sebagai ?urut= (B.1 no. 12)', async () => {
    const fetchTiruan = tiruFetch(200, { faq: [] });

    await ambilFaq({ q: 'sesi', urut: 'baru' });

    expect(panggilan(fetchTiruan).url).toBe(`${URL_API}/api/faq?q=sesi&urut=baru`);
  });

  test('urutan A–Z (bawaan) tidak dikirim (B.1 no. 12)', async () => {
    const fetchTiruan = tiruFetch(200, { faq: [] });

    await ambilFaq({ urut: 'az' });

    expect(panggilan(fetchTiruan).url).toBe(`${URL_API}/api/faq`);
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

describe('ambilPertanyaan', () => {
  test('mengirim GET /api/questions dan mengurai amplopnya (B.1 no. 11)', async () => {
    const daftar = [
      {
        idPertanyaan: 'p-1',
        isiPertanyaan: 'Kenapa?',
        nama: 'Sari',
        waktuPengajuan: '2026-11-12T08:00:00.000Z',
      },
    ];
    const fetchTiruan = tiruFetch(200, { pertanyaan: daftar });

    await expect(ambilPertanyaan()).resolves.toEqual(daftar);

    const { url, opsi } = panggilan(fetchTiruan);
    expect(url).toBe(`${URL_API}/api/questions`);
    expect(opsi.method).toBe('GET');
  });

  test('kata kunci dan batas waktu dikirim sebagai query (B.1 no. 11)', async () => {
    const fetchTiruan = tiruFetch(200, { pertanyaan: [] });

    await ambilPertanyaan({
      q: 'sari',
      sejak: '2026-11-01T00:00:00.000Z',
      sampai: '2026-11-30T23:59:59.999Z',
    });

    expect(panggilan(fetchTiruan).url).toBe(
      `${URL_API}/api/questions?q=sari&sejak=2026-11-01T00%3A00%3A00.000Z&sampai=2026-11-30T23%3A59%3A59.999Z`,
    );
  });

  test('parameter kosong tidak dikirim', async () => {
    const fetchTiruan = tiruFetch(200, { pertanyaan: [] });

    await ambilPertanyaan({ q: '   ' });

    expect(panggilan(fetchTiruan).url).toBe(`${URL_API}/api/questions`);
  });
});

describe('hapusPertanyaan', () => {
  test('mengirim DELETE ke /api/questions/:id tanpa isi (B.1 no. 11)', async () => {
    const fetchTiruan = tiruFetch(200, { ok: true, idPertanyaan: 'p 1' });

    await expect(hapusPertanyaan('p 1')).resolves.toEqual({ ok: true, idPertanyaan: 'p 1' });

    const { url, opsi } = panggilan(fetchTiruan);
    expect(url).toBe(`${URL_API}/api/questions/p%201`);
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
