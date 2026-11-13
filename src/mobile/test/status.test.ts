import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// Imported from the module, not the `@/api` barrel (see client.test.ts).
import { ApiError } from '@/api/client';
import { ambilStatus, ambilStatusLayanan, periksaStatusSekarang } from '@/api/status';

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

describe('periksaStatusSekarang', () => {
  /** Mocks the single POST the refresh route makes. */
  function tiruRefresh(status: number, isi: unknown) {
    const f = vi.fn(async () => new Response(JSON.stringify(isi), { status }));
    vi.stubGlobal('fetch', f);
    return f;
  }

  test('POST /api/status/refresh dan mengurai kedua baris', async () => {
    const f = tiruRefresh(200, {
      diperiksa: true,
      status: {
        server: { jenis: 'server', statusUptime: true, waktuCek: '2026-11-13T03:00:00Z' },
        db: { jenis: 'db', statusUptime: false, waktuCek: '2026-11-13T03:00:01Z' },
      },
    });

    const hasil = await periksaStatusSekarang();

    expect(hasil).toEqual({
      diperiksa: true,
      status: {
        server: { statusUptime: true, waktuCek: '2026-11-13T03:00:00Z' },
        db: { statusUptime: false, waktuCek: '2026-11-13T03:00:01Z' },
      },
    });
    const [url, opsi] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('http://sehati.test/api/status/refresh');
    expect(opsi.method).toBe('POST');
  });

  test('meneruskan diperiksa:false saat backend memakai hasil lama', async () => {
    tiruRefresh(200, { diperiksa: false, status: { server: null, db: null } });
    await expect(periksaStatusSekarang()).resolves.toEqual({
      diperiksa: false,
      status: { server: null, db: null },
    });
  });

  test('baris yang belum pernah dicek menjadi null, bukan galat', async () => {
    tiruRefresh(200, {
      diperiksa: true,
      status: { server: { jenis: 'server', statusUptime: true, waktuCek: 'x' }, db: null },
    });
    const hasil = await periksaStatusSekarang();
    expect(hasil.status.db).toBeNull();
  });
});
