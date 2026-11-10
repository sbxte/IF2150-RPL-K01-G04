/**
 * Presentation helpers for I-15 (Status Server), UC-10.
 *
 * Kept out of the screen so the formatting is unit-testable: components are not
 * rendered in this suite (see vitest.config.ts).
 */
import type { CekStatus, JenisStatus } from '@/api/status';
import { formatJam } from './waktu';

export type BarisStatus = {
  /** `website` / `server`, matching `status_server.jenis`. */
  jenis: JenisStatus;
  /** Title shown to the Administrator. */
  judul: string;
  /** One line explaining what this row actually measures. */
  keterangan: string;
  /** Badge text: "Up", "Down", or "Belum dicek". */
  label: string;
  /** Badge colour; `netral` for "never checked", which is not a failure. */
  warna: 'sukses' | 'merah' | 'netral';
  /** "Diperiksa 10.04" or a prompt when there is no check yet. */
  waktu: string;
};

/** What each service row measures. Mirrors the two probe targets in Algo-021. */
const META: Record<JenisStatus, { judul: string; keterangan: string }> = {
  website: {
    judul: 'Website',
    keterangan: 'Alamat publik Sehati dapat diakses.',
  },
  server: {
    judul: 'Server',
    keterangan: 'Worker dan basis data D1 merespons dengan sehat.',
  },
};

/**
 * Maps one service's latest check to display values.
 *
 * A `null` check means "never probed yet", not "down": the cron writes a row
 * every minute, so an empty table is expected on a fresh deployment and must
 * not be presented as an outage.
 */
export function barisStatus(jenis: JenisStatus, cek: CekStatus): BarisStatus {
  const meta = META[jenis];

  if (cek === null) {
    return { jenis, ...meta, label: 'Belum dicek', warna: 'netral', waktu: 'Belum ada pemeriksaan' };
  }

  return {
    jenis,
    ...meta,
    label: cek.statusUptime ? 'Up' : 'Down',
    warna: cek.statusUptime ? 'sukses' : 'merah',
    waktu: `Diperiksa ${formatJam(cek.waktuCek)}`,
  };
}

/** Both rows for the screen, in display order. */
export function semuaBarisStatus(status: {
  website: CekStatus;
  server: CekStatus;
}): BarisStatus[] {
  return [barisStatus('website', status.website), barisStatus('server', status.server)];
}

/** Time of the most recent check across both services, or `null` if never checked. */
export function waktuCekTerakhir(status: { website: CekStatus; server: CekStatus }): string | null {
  return (
    [status.website?.waktuCek, status.server?.waktuCek]
      .filter((w): w is string => !!w)
      .sort()
      .at(-1) ?? null
  );
}
