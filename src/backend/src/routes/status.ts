import { Hono } from "hono";
import { riwayatStatus, statusTerakhir } from "../db/queries";
import { JENIS_STATUS, type JenisStatus } from "../config";
import { gagalValidasi } from "../lib/errors";
import { angkaQuery } from "../lib/http";
import { jalankanCekStatus, probeMasihSegar } from "../lib/status-probe";
import { auth, requireRole, type AppEnv } from "../middleware/auth";

export const statusRoutes = new Hono<AppEnv>();

statusRoutes.use("*", auth);

/**
 * I-15-05: the most recent checks across both services, newest first (Q-044).
 *
 * Registered before `/:jenis` — that route is a catch-all parameter and would
 * otherwise swallow `/history` and reject it as an unknown jenis.
 *
 * Readable by any signed-in user, like `GET /api/status/:jenis` — it only exposes
 * what the cards already show, just more of it. The list is bounded by the
 * 7-day retention in `bersihkanDB`, and `?limit` clamps harder so a caller cannot
 * ask for the whole table.
 */
statusRoutes.get("/history", async (c) => {
  const limit = angkaQuery(c, "limit", 20, 100);
  const riwayat = await riwayatStatus(c.get("db"), limit);
  return c.json({ riwayat, limit });
});

/**
 * UC-10 — C-32 `tampilkanStatusServer(jenis)` / Algo-020, Q-017.
 * Both actors may read it; Admin uses it on the dashboard.
 */
statusRoutes.get("/:jenis", async (c) => {
  const jenis = c.req.param("jenis") as JenisStatus;
  if (!JENIS_STATUS.includes(jenis)) {
    throw gagalValidasi(`jenis harus salah satu dari: ${JENIS_STATUS.join(", ")}`);
  }

  const [baris] = await statusTerakhir(c.get("db"), jenis); // Q-017
  return c.json({
    status: baris
      ? { jenis: baris.jenis, statusUptime: baris.statusUptime, waktuCek: baris.waktuCek }
      : null,
  });
});

/**
 * I-15's "Periksa Sekarang": runs both probes now instead of reading whatever
 * the cron last wrote (Algo-021, Q-018).
 *
 * Administrator only, because it performs outbound requests to `API_BASE_URL`
 * and writes two rows — reachable by any other role it would be a free way to
 * generate traffic and history.
 *
 * Guarded by freshness: if a check landed within `PROBE_SEGAR_MS`, the existing
 * rows are returned and no probe runs. Each call costs two outbound requests and
 * two writes, so holding the button must not become a loop. `diperiksa` tells the
 * screen whether this call actually probed.
 */
statusRoutes.post("/refresh", requireRole("administrator"), async (c) => {
  const db = c.get("db");
  const segar = await probeMasihSegar(db);
  if (!segar) await jalankanCekStatus(c.env, db);

  const [server, basisData] = await Promise.all([
    statusTerakhir(db, "server"),
    statusTerakhir(db, "db"),
  ]);

  return c.json({
    diperiksa: !segar,
    status: { server: server[0] ?? null, db: basisData[0] ?? null },
  });
});
