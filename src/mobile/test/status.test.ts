import { afterEach, beforeEach, expect, test, vi } from 'vitest';

// Imported from the module, not the `@/api` barrel (see client.test.ts).
import { ApiError } from '@/api/client';
import { ambilStatus, ambilStatusLayanan } from '@/api/status';

beforeEach(() => {
  vi.stubEnv('EXPO_PUBLIC_API_URL', 'http://sehati.test');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

/** Answers each `/api/status/<jenis>` request with `jawaban[jenis]` (status 200 unless given). */
function tiruFetch(jawaban: Record<string, { status?: number; isi: unknown }>) {
  const fetchTiruan = vi.fn(async (url: string) => {
    const jenis = url.split('/').at(-1)!;
    const { status = 200, isi } = jawaban[jenis]!;
    return new Response(JSON.stringify(isi), { status });
  });
  vi.stubGlobal('fetch', fetchTiruan);
  return fetchTiruan;
}

test('ambilStatus mengembalikan cek terakhir tanpa field jenis', async () => {
  tiruFetch({
    server: { isi: { status: { jenis: 'server', statusUptime: false, waktuCek: '2026-11-09T03:00:00Z' } } },
  });
  await expect(ambilStatus('server')).resolves.toEqual({ statusUptime: false, waktuCek: '2026-11-09T03:00:00Z' });
});

test('ambilStatus mengembalikan null jika layanan belum pernah dicek', async () => {
  tiruFetch({ db: { isi: { status: null } } });
  await expect(ambilStatus('db')).resolves.toBeNull();
});

test('ambilStatusLayanan meminta server dan db lalu menggabungkannya', async () => {
  const fetchTiruan = tiruFetch({
    db: { isi: { status: { jenis: 'db', statusUptime: true, waktuCek: '2026-11-09T03:00:00Z' } } },
    server: { isi: { status: null } },
  });

  await expect(ambilStatusLayanan()).resolves.toEqual({
    db: { statusUptime: true, waktuCek: '2026-11-09T03:00:00Z' },
    server: null,
  });
  expect(fetchTiruan.mock.calls.map(([url]) => url).sort()).toEqual([
    'http://sehati.test/api/status/db',
    'http://sehati.test/api/status/server',
  ]);
});

test('ambilStatusLayanan gagal jika salah satu permintaan gagal', async () => {
  tiruFetch({
    db: { isi: { status: null } },
    server: { status: 500, isi: { error: { kode: 'GALAT_SERVER', pesan: 'Terjadi kesalahan pada server' } } },
  });

  const e = await ambilStatusLayanan().catch((galat: unknown) => galat);
  expect(e).toBeInstanceOf(ApiError);
  expect((e as ApiError).kode).toBe('GALAT_SERVER');
});
