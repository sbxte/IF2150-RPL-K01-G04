import { describe, expect, test } from 'vitest';

import { ApiError } from '@/api/client';
import {
  JUMLAH_HARI,
  PESAN_FORMAT_JAM,
  PESAN_GAGAL_MUAT,
  PESAN_GAGAL_SIMPAN,
  PESAN_URUTAN_JAM,
  daftarTanggal,
  jamKeIso,
  jamWib,
  klasifikasiGalatSimpan,
  labelTanggal,
  parseJam,
  rentangJamWib,
  tanggalWib,
  validasiFormJadwal,
  type SlotJadwal,
} from '@/lib/jadwal';

describe('teks banner I-12 (UC-05 alternatif 1 dan 2)', () => {
  test('I-12-08 dan I-12-07 sama persis dengan DPPL', () => {
    expect(PESAN_GAGAL_MUAT).toBe('Gagal mengambil data jadwal konsultasi. Tekan Muat ulang untuk mencoba lagi.');
    expect(PESAN_GAGAL_SIMPAN).toBe('Perubahan jadwal gagal disimpan. Tekan Simpan sekali lagi.');
  });
});

describe('tanggal dan jam dalam WIB', () => {
  test('tanggalWib memakai kalender WIB, bukan UTC', () => {
    // 20.00 UTC on the 29th is already 03.00 on the 30th in WIB.
    expect(tanggalWib('2026-10-29T20:00:00Z')).toBe('2026-10-30');
    expect(tanggalWib('2026-10-29T16:59:59Z')).toBe('2026-10-29');
    expect(tanggalWib('2026-10-29T17:00:00Z')).toBe('2026-10-30');
  });

  test('daftarTanggal memberi tiga hari berturut-turut mulai hari ini (WIB)', () => {
    expect(JUMLAH_HARI).toBe(3);
    expect(daftarTanggal(new Date('2026-10-30T02:00:00Z'))).toEqual(['2026-10-30', '2026-10-31', '2026-11-01']);
    // 23.00 UTC is 06.00 the next day in WIB, so "today" is already the 31st.
    expect(daftarTanggal(new Date('2026-10-30T23:00:00Z'))).toEqual(['2026-10-31', '2026-11-01', '2026-11-02']);
  });

  test('daftarTanggal melewati pergantian bulan dan tahun', () => {
    expect(daftarTanggal(new Date('2026-12-30T03:00:00Z'))).toEqual(['2026-12-30', '2026-12-31', '2027-01-01']);
  });

  test('labelTanggal berformat "Hari, tanggal Bulan"', () => {
    expect(labelTanggal('2026-10-30')).toBe('Jum, 30 Okt');
    expect(labelTanggal('2026-10-29')).toBe('Kam, 29 Okt');
    expect(labelTanggal('2026-11-02')).toBe('Sen, 2 Nov');
  });

  test('jamWib dan rentangJamWib', () => {
    expect(jamWib('2026-10-30T02:00:00Z')).toBe('09.00');
    expect(jamWib('2026-10-30T02:00:00.000Z')).toBe('09.00');
    expect(jamWib('2026-10-30T17:30:00Z')).toBe('00.30');
    expect(rentangJamWib('2026-10-30T02:00:00Z', '2026-10-30T03:30:00Z')).toBe('09.00–10.30');
  });
});

describe('parseJam', () => {
  test.each([
    ['09.00', '09:00'],
    ['9.00', '09:00'],
    ['09:00', '09:00'],
    ['9:05', '09:05'],
    ['23.59', '23:59'],
    ['00.00', '00:00'],
    ['  10.30  ', '10:30'],
  ])('membaca %j sebagai %s', (masuk, keluar) => {
    expect(parseJam(masuk)).toBe(keluar);
  });

  test.each(['', '9', '900', '24.00', '23.60', '9.5', '09.000', 'sembilan', '09-00', '09.00 pagi', '-1.00'])(
    'menolak %j',
    (masuk) => {
      expect(parseJam(masuk)).toBeNull();
    },
  );
});

describe('jamKeIso', () => {
  test('mengubah jam WIB menjadi instan UTC', () => {
    expect(jamKeIso('2026-10-30', '09:00')).toBe('2026-10-30T02:00:00.000Z');
    expect(jamKeIso('2026-10-30', '00:30')).toBe('2026-10-29T17:30:00.000Z');
  });
});

describe('validasiFormJadwal (cerminan Algo-025 di sisi klien)', () => {
  const TGL = '2026-10-30';
  // Existing slots on that day: 09.00-10.00 and 11.00-12.00 WIB.
  const lain: SlotJadwal[] = [
    { idJadwal: 'a', waktu: '2026-10-30T02:00:00.000Z', waktuSelesai: '2026-10-30T03:00:00.000Z' },
    { idJadwal: 'b', waktu: '2026-10-30T04:00:00Z', waktuSelesai: '2026-10-30T05:00:00Z' },
  ];

  test('menerima slot yang valid dan menghasilkan waktu ISO UTC', () => {
    expect(validasiFormJadwal(TGL, '10.00', '11.00', lain)).toEqual({
      ok: true,
      waktu: '2026-10-30T03:00:00.000Z',
      waktuSelesai: '2026-10-30T04:00:00.000Z',
    });
  });

  test('slot yang menempel pada slot lain bukan tumpang tindih', () => {
    expect(validasiFormJadwal(TGL, '10.00', '11.00', lain).ok).toBe(true);
    expect(validasiFormJadwal(TGL, '08.00', '09.00', lain).ok).toBe(true);
    expect(validasiFormJadwal(TGL, '12.00', '13.00', lain).ok).toBe(true);
  });

  test('jam kosong atau salah format ditolak per kolom', () => {
    expect(validasiFormJadwal(TGL, '', '10.00', lain)).toEqual({ ok: false, galat: { mulai: PESAN_FORMAT_JAM } });
    expect(validasiFormJadwal(TGL, '09.00', 'siang', lain)).toEqual({ ok: false, galat: { selesai: PESAN_FORMAT_JAM } });
    expect(validasiFormJadwal(TGL, '', '', lain)).toEqual({
      ok: false,
      galat: { mulai: PESAN_FORMAT_JAM, selesai: PESAN_FORMAT_JAM },
    });
    expect(validasiFormJadwal(TGL, '25.00', '26.00', lain).ok).toBe(false);
  });

  test('jam selesai yang sama dengan jam mulai ditolak', () => {
    expect(validasiFormJadwal(TGL, '13.00', '13.00', lain)).toEqual({ ok: false, galat: { selesai: PESAN_URUTAN_JAM } });
  });

  test('jam selesai sebelum jam mulai ditolak', () => {
    expect(validasiFormJadwal(TGL, '14.00', '13.00', lain)).toEqual({ ok: false, galat: { selesai: PESAN_URUTAN_JAM } });
  });

  test('"9.00" dan "10.00" dibandingkan sebagai waktu, bukan teks', () => {
    // As text "9.00" > "10.00", but 09.00 is before 10.00.
    expect(validasiFormJadwal(TGL, '9.00', '10.00', []).ok).toBe(true);
  });

  test.each([
    ['sebagian dari depan', '08.30', '09.30'],
    ['sebagian dari belakang', '09.30', '10.30'],
    ['membungkus slot lain', '08.00', '10.30'],
    ['di dalam slot lain', '09.15', '09.45'],
    ['persis sama', '09.00', '10.00'],
    ['menjembatani dua slot', '09.30', '11.30'],
  ])('menolak slot yang %s', (_nama, mulai, selesai) => {
    const hasil = validasiFormJadwal(TGL, mulai, selesai, lain);
    expect(hasil.ok).toBe(false);
    if (!hasil.ok) expect(hasil.galat.umum).toMatch(/bertumpang tindih/);
  });

  test('pesan tumpang tindih menyebut slot yang bertabrakan', () => {
    const hasil = validasiFormJadwal(TGL, '09.30', '10.30', lain);
    expect(hasil.ok).toBe(false);
    if (!hasil.ok) expect(hasil.galat.umum).toContain('09.00–10.00');
  });

  test('saat mengedit, slot itu sendiri tidak dihitung', () => {
    expect(validasiFormJadwal(TGL, '09.30', '10.30', lain, 'a').ok).toBe(true);
    expect(validasiFormJadwal(TGL, '09.00', '10.00', lain, 'a').ok).toBe(true);
  });

  test('saat mengedit, slot lain tetap menghalangi', () => {
    const hasil = validasiFormJadwal(TGL, '10.30', '11.30', lain, 'a');
    expect(hasil.ok).toBe(false);
  });

  test('slot di hari lain tidak ikut dibandingkan', () => {
    const besok: SlotJadwal[] = [{ idJadwal: 'c', waktu: '2026-10-31T02:00:00Z', waktuSelesai: '2026-10-31T03:00:00Z' }];
    expect(validasiFormJadwal(TGL, '09.00', '10.00', besok).ok).toBe(true);
  });
});

describe('klasifikasiGalatSimpan', () => {
  test.each([
    [409, 'JADWAL_BENTROK', 'Slot bertumpang tindih dengan jadwal konsultan lain'],
    [422, 'VALIDASI_GAGAL', 'Waktu selesai harus setelah waktu mulai'],
    [404, 'TIDAK_DITEMUKAN', 'Slot jadwal tidak ditemukan'],
    [400, 'PERMINTAAN_TIDAK_VALID', 'Body harus berupa JSON yang valid'],
  ])('HTTP %i dianggap ditolak dengan pesan server', (status, kode, pesan) => {
    expect(klasifikasiGalatSimpan(new ApiError(status, kode, pesan))).toEqual({ jenis: 'ditolak', pesan });
  });

  test.each([
    [500, 'GAGAL_MENYIMPAN_JADWAL'],
    [500, 'KESALAHAN_SERVER'],
    [502, 'GAGAL_LAYANAN_EKSTERNAL'],
    [0, 'JARINGAN_GAGAL'],
    [0, 'BATAS_WAKTU'],
  ])('HTTP %i (%s) dianggap gagal menyimpan (banner I-12-07)', (status, kode) => {
    expect(klasifikasiGalatSimpan(new ApiError(status, kode, 'apa pun'))).toEqual({ jenis: 'gagal' });
  });

  test('galat yang bukan ApiError juga dianggap gagal menyimpan', () => {
    expect(klasifikasiGalatSimpan(new Error('boom'))).toEqual({ jenis: 'gagal' });
    expect(klasifikasiGalatSimpan('teks')).toEqual({ jenis: 'gagal' });
    expect(klasifikasiGalatSimpan(undefined)).toEqual({ jenis: 'gagal' });
  });
});
