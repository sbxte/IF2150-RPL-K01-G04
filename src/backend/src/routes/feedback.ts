import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import {
  daftarUmpanBalik,
  kirimUmpanBalik,
  tanggapiUmpanBalik,
  umpanBalikMilik,
  type StatusUmpanBalik,
} from "../db/queries";
import { gagalValidasi, tidakDitemukan } from "../lib/errors";
import { angkaQuery, bacaBody } from "../lib/http";
import { auth, requireRole, type AppEnv } from "../middleware/auth";

export const feedbackRoutes = new Hono<AppEnv>();

feedbackRoutes.use("*", auth);

/** UC-08 — C-31 `kirimFeedback(isi)`, Algo-026 then Q-038. */
feedbackRoutes.post("/", requireRole("mahasiswa"), async (c) => {
  const body = await bacaBody(c);
  const isi = body.isi;

  if (typeof isi !== "string" || isi.trim().length === 0) {
    throw gagalValidasi("isi umpan balik wajib diisi");
  }

  const idUmpanBalik = randomUUID();
  await kirimUmpanBalik(c.get("db"), {
    idUmpanBalik, // Q-038
    idMahasiswa: c.get("idPengguna"),
    isi: isi.trim(),
  });

  return c.json({ ok: true, idUmpanBalik }, 201);
});

/**
 * UC-08 — I-11-06: the caller's own feedback, newest first (Q-043).
 *
 * The DPPL shows a Mahasiswa their past feedback and the administrator's
 * response, but `GET /api/feedback` is administrator-only and returns everyone's,
 * so this needed its own path. Registered before `/:id` style routes is not
 * necessary here — there is no conflicting parameter route — but the explicit
 * path keeps the student scope impossible to reach by accident.
 */
feedbackRoutes.get("/mine", requireRole("mahasiswa"), async (c) => {
  const feedback = await umpanBalikMilik(c.get("db"), c.get("idPengguna"));
  return c.json({ feedback });
});

/**
 * UC-09 — C-31 `tampilkanListFeedback()` / Q-016.
 * The DPPL sets no limit, so `?limit` (default 100, max 200) and `?offset` paginate.
 * `?status=belum|sudah` backs I-14-02's filter chips; anything else is ignored,
 * matching how `?limit` degrades rather than erroring.
 */
feedbackRoutes.get("/", requireRole("administrator"), async (c) => {
  const limit = angkaQuery(c, "limit", 100, 200);
  const offset = angkaQuery(c, "offset", 0, 1_000_000);
  const mentah = c.req.query("status");
  const status: StatusUmpanBalik | undefined =
    mentah === "belum" || mentah === "sudah" ? mentah : undefined;

  const daftar = await daftarUmpanBalik(c.get("db"), { limit, offset, status });
  return c.json({ feedback: daftar, limit, offset, status: status ?? null });
});

/** UC-09 — C-31 `kirimTanggapan()`, Algo-026 then Q-039. */
feedbackRoutes.put("/:id/response", requireRole("administrator"), async (c) => {
  const idUmpanBalik = c.req.param("id");
  const body = await bacaBody(c);
  const tanggapan = body.tanggapan;

  if (typeof tanggapan !== "string" || tanggapan.trim().length === 0) {
    throw gagalValidasi("tanggapan wajib diisi");
  }

  const hasil = await tanggapiUmpanBalik(c.get("db"), {
    idUmpanBalik, // Q-039
    tanggapan: tanggapan.trim(),
    idAdministrator: c.get("idPengguna"),
  });
  if ((hasil.meta?.changes ?? 0) === 0) throw tidakDitemukan("Umpan balik tidak ditemukan");

  return c.json({ ok: true, idUmpanBalik });
});
