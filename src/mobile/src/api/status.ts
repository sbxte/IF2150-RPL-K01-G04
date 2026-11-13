/**
 * Service status (DPPL C-32 `StatusServerController`, Algo-020, Q-017).
 */
import { api } from './client';

export type JenisStatus = 'server' | 'db';

/** Latest check of one service (`StatusServer`); `null` if it was never checked. */
export type CekStatus = {
  statusUptime: boolean;
  /** ISO 8601 */
  waktuCek: string;
} | null;

export type StatusLayanan = Record<JenisStatus, CekStatus>;

/** `tampilkanStatusServer(jenis)`: the latest check of one service. */
export async function ambilStatus(jenis: JenisStatus): Promise<CekStatus> {
  const { status } = await api.get<{ status: (NonNullable<CekStatus> & { jenis: JenisStatus }) | null }>(
    `/api/status/${jenis}`,
  );
  return status && { statusUptime: status.statusUptime, waktuCek: status.waktuCek };
}

/** Both services for the I-03 card, requested in parallel. */
export async function ambilStatusLayanan(): Promise<StatusLayanan> {
  const [server, db] = await Promise.all([ambilStatus('server'), ambilStatus('db')]);
  return { server, db };
}

/** A row as the refresh route returns it: the check plus its `jenis`. */
type CekBerjenis = NonNullable<CekStatus> & { jenis: JenisStatus };

/**
 * I-15's "Periksa Sekarang": asks the backend to probe both services now and
 * returns the fresh results (`POST /api/status/refresh`, Algo-021).
 *
 * Unlike `ambilStatusLayanan`, this is not a plain read: it makes the Worker
 * perform two outbound requests. The backend skips the probe when a check landed
 * within 30 seconds and reports that through `diperiksa`, so a double tap reuses
 * the previous result instead of hammering the endpoints.
 */
export async function periksaStatusSekarang(): Promise<{
  status: StatusLayanan;
  /** `false` when the backend reused a check newer than its freshness window. */
  diperiksa: boolean;
}> {
  const { status, diperiksa } = await api.post<{
    status: { server: CekBerjenis | null; db: CekBerjenis | null };
    diperiksa: boolean;
  }>('/api/status/refresh');

  const ke = (c: CekBerjenis | null): CekStatus =>
    c ? { statusUptime: c.statusUptime, waktuCek: c.waktuCek } : null;

  return { status: { server: ke(status.server), db: ke(status.db) }, diperiksa };
}
