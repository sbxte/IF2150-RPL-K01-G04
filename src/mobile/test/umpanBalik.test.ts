import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// Imported from the module itself, not the `@/api` barrel (see client.test.ts).
import {
  ambilUmpanBalik,
  ambilUmpanBalikSaya,
  kirimUmpanBalik,
  tanggapiUmpanBalik,
} from '@/api/umpan-balik';

const URL_API = 'http://sehati.test';

/** Replaces `fetch` with a mock answering `status` with `isi`. */
function tiruFetch(status: number, isi?: unknown) {
  const teks = isi === undefined ? '' : JSON.stringify(isi);
  const fetchTiruan = vi.fn(async () => new Response(teks || null, { status }));
  vi.stubGlobal('fetch', fetchTiruan);
  return fetchTiruan;
}

/** URL and options of the n-th `fetch` call. */
function panggilan(fetchTiruan: ReturnType<typeof tiruFetch>, n = 0) {
  const [url, opsi] = fetchTiruan.mock.calls[n] as unknown as [string, RequestInit];
  return { url, opsi, isi: opsi.body ? JSON.parse(opsi.body as string) : undefined };
}

beforeEach(() => {
  vi.stubEnv('EXPO_PUBLIC_API_URL', URL_API);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('kirimUmpanBalik', () => {
  test('mengirim POST /api/feedback dengan { isi } (Q-038)', async () => {
    const f = tiruFetch(201, { ok: true, idUmpanBalik: 'u1' });

    await kirimUmpanBalik('Aplikasinya bagus');

    const { url, opsi, isi } = panggilan(f);
    expect(url).toBe(`${URL_API}/api/feedback`);
    expect(opsi.method).toBe('POST');
    expect(isi).toEqual({ isi: 'Aplikasinya bagus' });
  });
});

describe('ambilUmpanBalikSaya', () => {
  test('meminta /api/feedback/mine dan mengurai amplopnya (Q-043)', async () => {
    const baris = { idUmpanBalik: 'u1', isi: 'halo', tanggapan: null, idAdministrator: null };
    const f = tiruFetch(200, { feedback: [baris] });

    await expect(ambilUmpanBalikSaya()).resolves.toEqual([baris]);

    const { url, opsi } = panggilan(f);
    expect(url).toBe(`${URL_API}/api/feedback/mine`);
    expect(opsi.method).toBe('GET');
  });

  test('mengembalikan daftar kosong bila belum pernah memberi umpan balik', async () => {
    tiruFetch(200, { feedback: [] });
    await expect(ambilUmpanBalikSaya()).resolves.toEqual([]);
  });
});

describe('ambilUmpanBalik', () => {
  test('tanpa filter meminta /api/feedback tanpa ?status (Semua)', async () => {
    const f = tiruFetch(200, { feedback: [] });

    await ambilUmpanBalik();

    expect(panggilan(f).url).toBe(`${URL_API}/api/feedback`);
  });

  test('meneruskan ?status=belum dan ?status=sudah (I-14-02)', async () => {
    const f = tiruFetch(200, { feedback: [] });

    await ambilUmpanBalik({ status: 'belum' });
    await ambilUmpanBalik({ status: 'sudah' });

    expect(panggilan(f, 0).url).toBe(`${URL_API}/api/feedback?status=belum`);
    expect(panggilan(f, 1).url).toBe(`${URL_API}/api/feedback?status=sudah`);
  });
});

describe('tanggapiUmpanBalik', () => {
  test('mengirim PUT ke /api/feedback/:id/response dengan { tanggapan } (Q-039)', async () => {
    const f = tiruFetch(200, { ok: true, idUmpanBalik: 'u1' });

    await tanggapiUmpanBalik('u1', 'sudah kami tangani');

    const { url, opsi, isi } = panggilan(f);
    expect(url).toBe(`${URL_API}/api/feedback/u1/response`);
    expect(opsi.method).toBe('PUT');
    expect(isi).toEqual({ tanggapan: 'sudah kami tangani' });
    // The backend stamps id_administrator from the session, so it must not be sent.
    expect(isi).not.toHaveProperty('idAdministrator');
  });

  test('meng-encode id umpan balik pada jalur', async () => {
    const f = tiruFetch(200, { ok: true, idUmpanBalik: 'a/b c' });

    await tanggapiUmpanBalik('a/b c', 'ok');

    expect(panggilan(f).url).toBe(`${URL_API}/api/feedback/a%2Fb%20c/response`);
  });
});
