import type { Db } from "../db/queries";
import { catatStatus, statusTerakhir } from "../db/queries";
import { JENIS_STATUS, type JenisStatus } from "../config";

/**
 * Algo-021 `cekStatusServer`, shared by the cron (`jobs/scheduler.ts`) and the
 * administrator's on-demand probe (`POST /api/status/refresh`).
 *
 * It lives here rather than in the scheduler so a route does not have to import
 * the scheduler. Two probes, in dependency order, because they answer different
 * questions:
 *
 *   server -> the public domain reaches the Worker (no database involved)
 *   db     -> the Worker can query D1 (the route issues a SELECT)
 *
 * Probing the origin `/` would be wrong: the Worker has no route there, so it
 * answers 404 and the row would always read Down.
 */

/** How long a probe is considered fresh; a refresh within this window is skipped. */
export const PROBE_SEGAR_MS = 30_000;

/** Outbound timeout per probe, matching the cron. */
const BATAS_WAKTU_MS = 5000;

/** The URL each jenis probes, or `""` when `API_BASE_URL` is unset. */
export function targetProbe(
  env: Env,
): Record<JenisStatus, string> {
  const origin = ((env as unknown as Record<string, string | undefined>).API_BASE_URL ?? "").replace(
    /\/+$/,
    "",
  );
  return {
    server: origin ? `${origin}/health` : "",
    db: origin ? `${origin}/health/db` : "",
  };
}

/** Probes one endpoint. Only 2xx counts; a 3xx means misrouting, so it is down. */
async function periksaSatu(alamat: string): Promise<boolean> {
  if (!alamat) return false;
  try {
    const respons = await fetch(alamat, {
      method: "GET",
      signal: AbortSignal.timeout(BATAS_WAKTU_MS),
    });
    return respons.status >= 200 && respons.status <= 299;
  } catch {
    return false;
  }
}

/**
 * Runs both probes and records the results (Q-018).
 * Returns what was written so a caller can answer without re-reading.
 */
export async function jalankanCekStatus(
  env: Env,
  db: Db,
): Promise<Record<JenisStatus, boolean>> {
  const target = targetProbe(env);
  const hasil = {} as Record<JenisStatus, boolean>;

  for (const jenis of JENIS_STATUS) {
    const up = await periksaSatu(target[jenis]);
    hasil[jenis] = up;
    await catatStatus(db, {
      jenis,
      statusUptime: up,
      waktuCek: new Date().toISOString(), // Q-018
    });
  }
  return hasil;
}

/**
 * Whether the newest recorded check is still fresh.
 *
 * Guards the administrator's on-demand probe: each call costs two outbound
 * requests and two writes, so holding the button must not turn into a loop. If
 * the cron already probed within `PROBE_SEGAR_MS`, that result is reused.
 */
export async function probeMasihSegar(db: Db): Promise<boolean> {
  const terbaru = await Promise.all(JENIS_STATUS.map((jenis) => statusTerakhir(db, jenis)));
  const waktu = terbaru
    .map((baris) => baris[0]?.waktuCek)
    .filter((w): w is string => typeof w === "string")
    .sort()
    .at(-1);

  if (!waktu) return false;
  const umur = Date.now() - new Date(waktu).getTime();
  return Number.isFinite(umur) && umur >= 0 && umur < PROBE_SEGAR_MS;
}
