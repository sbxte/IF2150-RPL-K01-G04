import { describe, expect, test } from 'vitest';

import { barisStatus, semuaBarisStatus, waktuCekTerakhir } from '@/lib/status';

const CEK_UP = { statusUptime: true, waktuCek: '2026-11-10T03:00:00.000Z' };
const CEK_DOWN = { statusUptime: false, waktuCek: '2026-11-10T03:05:00.000Z' };

describe('barisStatus', () => {
  test('menampilkan Up untuk layanan yang hidup', () => {
    const baris = barisStatus('server', CEK_UP);
    expect(baris).toMatchObject({ jenis: 'server', label: 'Up', warna: 'sukses' });
  });

  test('menampilkan Down untuk layanan yang mati', () => {
    const baris = barisStatus('website', CEK_DOWN);
    expect(baris).toMatchObject({ jenis: 'website', label: 'Down', warna: 'merah' });
  });

  test('belum pernah dicek bukan berarti Down', () => {
    // A fresh deployment has an empty status_server table; the cron fills it a
    // minute later. Showing "Down" there would report an outage that never happened.
    const baris = barisStatus('website', null);
    expect(baris).toMatchObject({ label: 'Belum dicek', warna: 'netral' });
    expect(baris.warna).not.toBe('merah');
  });

  test('judul dan keterangan membedakan website dari server', () => {
    const web = barisStatus('website', CEK_UP);
    const srv = barisStatus('server', CEK_UP);
    expect(web.judul).not.toBe(srv.judul);
    expect(web.keterangan).not.toBe(srv.keterangan);
  });

  test('waktu ditampilkan dalam WIB', () => {
    // 03:00 UTC = 10:00 WIB
    expect(barisStatus('server', CEK_UP).waktu).toContain('10.00');
  });

  test('waktu memberi tahu bila belum ada pemeriksaan', () => {
    expect(barisStatus('server', null).waktu).toMatch(/belum ada pemeriksaan/i);
  });
});

describe('semuaBarisStatus', () => {
  test('selalu mengembalikan dua baris, website lebih dulu', () => {
    const baris = semuaBarisStatus({ website: CEK_UP, server: CEK_DOWN });
    expect(baris.map((b) => b.jenis)).toEqual(['website', 'server']);
    expect(baris[0]?.label).toBe('Up');
    expect(baris[1]?.label).toBe('Down');
  });

  test('menangani keduanya belum dicek', () => {
    const baris = semuaBarisStatus({ website: null, server: null });
    expect(baris.every((b) => b.warna === 'netral')).toBe(true);
  });
});

describe('waktuCekTerakhir', () => {
  test('null bila belum ada pemeriksaan sama sekali', () => {
    expect(waktuCekTerakhir({ website: null, server: null })).toBeNull();
  });

  test('memilih yang paling baru dari kedua layanan', () => {
    expect(waktuCekTerakhir({ website: CEK_UP, server: CEK_DOWN })).toBe(CEK_DOWN.waktuCek);
  });

  test('mengabaikan layanan yang belum dicek', () => {
    expect(waktuCekTerakhir({ website: null, server: CEK_UP })).toBe(CEK_UP.waktuCek);
    expect(waktuCekTerakhir({ website: CEK_DOWN, server: null })).toBe(CEK_DOWN.waktuCek);
  });
});
