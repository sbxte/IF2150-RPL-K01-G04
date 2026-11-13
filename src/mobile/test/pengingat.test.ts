import { afterEach, beforeEach, expect, test, vi } from 'vitest';

// Imported from the module, not the `@/api` barrel (see client.test.ts).
import { ambilPengingat, hapusPengingat, simpanPengingat } from '@/api/pengingat';

beforeEach(() => {
  vi.stubEnv('EXPO_PUBLIC_API_URL', 'http://sehati.test');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function tiruFetch(isi: unknown) {
  const fetchTiruan = vi.fn(
    async (_url: string, _init?: RequestInit) => new Response(JSON.stringify(isi), { status: 200 }),
  );
  vi.stubGlobal('fetch', fetchTiruan);
  return fetchTiruan;
}

test('ambilPengingat membuka amplop { reminders } dari GET /api/reminders', async () => {
  const reminders = [
    { jenis: 'makan', waktu: '12:00' },
    { jenis: 'tidur', waktu: null },
    { jenis: 'olahraga', waktu: '17:00' },
  ];
  const fetchTiruan = tiruFetch({ reminders });

  await expect(ambilPengingat()).resolves.toEqual(reminders);
  expect(fetchTiruan.mock.calls[0]?.[0]).toBe('http://sehati.test/api/reminders');
});

test('simpanPengingat mengirim PUT { waktu } ke /api/reminders/:jenis', async () => {
  const fetchTiruan = tiruFetch({ ok: true, jenis: 'tidur', waktu: '22:00' });

  await expect(simpanPengingat('tidur', '22:00')).resolves.toBeUndefined();

  const [url, opsi] = fetchTiruan.mock.calls[0] as [string, RequestInit];
  expect(url).toBe('http://sehati.test/api/reminders/tidur');
  expect(opsi.method).toBe('PUT');
  expect(JSON.parse(String(opsi.body))).toEqual({ waktu: '22:00' });
});

test('hapusPengingat mengirim DELETE ke /api/reminders/:jenis tanpa isi', async () => {
  const fetchTiruan = tiruFetch({ ok: true, jenis: 'makan' });

  await expect(hapusPengingat('makan')).resolves.toBeUndefined();

  const [url, opsi] = fetchTiruan.mock.calls[0] as [string, RequestInit];
  expect(url).toBe('http://sehati.test/api/reminders/makan');
  expect(opsi.method).toBe('DELETE');
  expect(opsi.body).toBeUndefined();
});

test('ambilPengingat mengembalikan tiga jenis dengan waktu null saat belum diatur', async () => {
  tiruFetch({
    reminders: [
      { jenis: 'makan', waktu: null },
      { jenis: 'tidur', waktu: null },
      { jenis: 'olahraga', waktu: null },
    ],
  });

  const daftar = await ambilPengingat();
  expect(daftar.map((p) => p.jenis)).toEqual(['makan', 'tidur', 'olahraga']);
  expect(daftar.every((p) => p.waktu === null)).toBe(true);
});
