import { afterEach, beforeEach, expect, test, vi } from 'vitest';

// Imported from the module, not the `@/api` barrel (see client.test.ts).
import { ApiError } from '@/api/client';
import {
  ambilDaftarKonsultan,
  ambilSlotKonsultan,
  ambilSesiBerikutnya,
  perbaruiJadwal,
  pesanSesi,
  simpanJadwal,
} from '@/api/konsultasi';

beforeEach(() => {
  process.env.EXPO_PUBLIC_API_URL = 'http://sehati.test';
});

afterEach(() => {
  vi.restoreAllMocks();
  globalThis.fetch = fetchAsli;
});
const fetchAsli = globalThis.fetch;

function tiruFetch(isi: unknown) {
  const fetchTiruan = vi.fn(
    async (url: string, options?: RequestInit) =>
      new Response(JSON.stringify(isi), { status: 200 })
  );

  globalThis.fetch = fetchTiruan as typeof fetch;

  return fetchTiruan;
}

test('ambilSesiBerikutnya membuka amplop { session } dari GET /api/sessions/next', async () => {
  const sesi = {
    idJadwal: 'seed-jdw-1-1-4',
    waktu: '2026-11-10T04:00:00Z',
    waktuSelesai: '2026-11-10T05:00:00Z',
    nama: 'Dr. Raisa Wibowo, M.Psi.',
    spesialisasi: 'Psikologi Klinis',
  };
  const fetchTiruan = tiruFetch({ session: sesi });

  await expect(ambilSesiBerikutnya()).resolves.toEqual(sesi);
  expect(fetchTiruan.mock.calls[0]?.[0]).toBe('http://sehati.test/api/sessions/next');
});

test('ambilSesiBerikutnya mengembalikan null tanpa sesi terpesan', async () => {
  tiruFetch({ session: null });
  await expect(ambilSesiBerikutnya()).resolves.toBeNull();
});


test('ambilDaftarKonsultan membuka amplop consultants dari GET /api/consultants', async () => {
  const daftar = [{ idKonsultan: 'k1', nama: 'Dr. Raisa', spesialisasi: 'Psikologi Klinis' }];
  const fetchTiruan = tiruFetch({ consultants: daftar });
  await expect(ambilDaftarKonsultan()).resolves.toEqual(daftar);
  expect(fetchTiruan.mock.calls[0]?.[0]).toBe('http://sehati.test/api/consultants');
});

test('ambilSlotKonsultan meminta slot konsultan tertentu', async () => {
  const slots = [{ idJadwal: 'j1', waktu: '2031-06-01T03:00:00Z', waktuSelesai: '2031-06-01T04:00:00Z', status: 'tersedia' }];
  const fetchTiruan = tiruFetch({ slots });
  await expect(ambilSlotKonsultan('k 1')).resolves.toEqual(slots);
  expect(fetchTiruan.mock.calls[0]?.[0]).toBe('http://sehati.test/api/consultants/k%201/slots');
});

test('pesanSesi mengirim POST ke endpoint booking slot', async () => {
  const fetchTiruan = tiruFetch({ ok: true });
  await expect(pesanSesi('jadwal/1')).resolves.toBeUndefined();
  expect(fetchTiruan.mock.calls[0]?.[0]).toBe('http://sehati.test/api/slots/jadwal%2F1/book');
  expect(fetchTiruan.mock.calls[0]?.[1]).toMatchObject({ method: 'POST' });
});

test('simpanJadwal mengirim POST /api/slots dengan konsultan dan waktunya, lalu mengembalikan idJadwal', async () => {
  const fetchTiruan = vi.fn(async () => new Response(JSON.stringify({ ok: true, idJadwal: 'baru-1' }), { status: 201 }));
  globalThis.fetch = fetchTiruan as unknown as typeof fetch;
  const jadwal = { idKonsultan: 'k1', waktu: '2031-06-01T03:00:00.000Z', waktuSelesai: '2031-06-01T04:00:00.000Z' };

  await expect(simpanJadwal(jadwal)).resolves.toEqual({ idJadwal: 'baru-1' });

  const [url, opsi] = fetchTiruan.mock.calls[0] as unknown as [string, RequestInit];
  expect(url).toBe('http://sehati.test/api/slots');
  expect(opsi).toMatchObject({ method: 'POST' });
  expect(JSON.parse(String(opsi.body))).toEqual(jadwal);
});

test('perbaruiJadwal mengirim PATCH /api/slots/:id hanya dengan waktu mulai dan selesai', async () => {
  const fetchTiruan = tiruFetch({ ok: true, idJadwal: 'jadwal/1' });
  const waktu = { waktu: '2031-06-01T03:30:00.000Z', waktuSelesai: '2031-06-01T04:30:00.000Z' };

  await expect(perbaruiJadwal('jadwal/1', waktu)).resolves.toBeUndefined();

  expect(fetchTiruan.mock.calls[0]?.[0]).toBe('http://sehati.test/api/slots/jadwal%2F1');
  const opsi = fetchTiruan.mock.calls[0]?.[1] as RequestInit;
  expect(opsi).toMatchObject({ method: 'PATCH' });
  expect(JSON.parse(String(opsi.body))).toEqual(waktu);
});

test('simpanJadwal meneruskan bentrok (409) dan galat server (500) sebagai ApiError', async () => {
  const jadwal = { idKonsultan: 'k1', waktu: '2031-06-01T03:00:00.000Z', waktuSelesai: '2031-06-01T04:00:00.000Z' };
  const balas = (status: number, kode: string, pesan: string) => {
    globalThis.fetch = vi.fn(
      async () => new Response(JSON.stringify({ error: { kode, pesan } }), { status }),
    ) as unknown as typeof fetch;
  };

  balas(409, 'JADWAL_BENTROK', 'Slot bertumpang tindih dengan jadwal konsultan lain');
  await expect(simpanJadwal(jadwal)).rejects.toMatchObject({ status: 409, kode: 'JADWAL_BENTROK' });

  balas(500, 'GAGAL_MENYIMPAN_JADWAL', 'Perubahan jadwal gagal disimpan. Tekan Simpan sekali lagi.');
  const galat = await simpanJadwal(jadwal).catch((e: unknown) => e);
  expect(galat).toBeInstanceOf(ApiError);
  expect(galat).toMatchObject({ status: 500, kode: 'GAGAL_MENYIMPAN_JADWAL' });
});

test('perbaruiJadwal meneruskan 422 ke pemanggil', async () => {
  globalThis.fetch = vi.fn(
    async () => new Response(JSON.stringify({ error: { kode: 'VALIDASI_GAGAL', pesan: 'Waktu selesai harus setelah waktu mulai' } }), { status: 422 }),
  ) as unknown as typeof fetch;
  await expect(
    perbaruiJadwal('j1', { waktu: '2031-06-01T04:00:00.000Z', waktuSelesai: '2031-06-01T03:00:00.000Z' }),
  ).rejects.toMatchObject({ status: 422, kode: 'VALIDASI_GAGAL' });
});
