import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import { ajukanPertanyaan, daftarPertanyaan, hapusPertanyaan } from "../db/queries";
import { gagalValidasi, tidakDitemukan } from "../lib/errors";
import { bacaBody } from "../lib/http";
import { auth, requireRole, type AppEnv } from "../middleware/auth";

/**
 * PengajuanPertanyaan routes (C-30 `kirimPertanyaan`, UC-12). The administrator
 * list and delete are additions from M9 B.1 no. 11: the DPPL has no screen for
 * submitted questions, so I-10's "dikirim ke Administrator" had nowhere to go.
 */
export const questionRoutes = new Hono<AppEnv>();

questionRoutes.use("*", auth);

/** UC-12 — Algo-026 `validasiInput` then Q-040. */
questionRoutes.post("/", requireRole("mahasiswa"), async (c) => {
  const body = await bacaBody(c);
  const isi = body.isi ?? body.isiPertanyaan;

  if (typeof isi !== "string" || isi.trim().length === 0) {
    throw gagalValidasi("isi pertanyaan wajib diisi");
  }

  const idPertanyaan = randomUUID();
  await ajukanPertanyaan(c.get("db"), {
    idPertanyaan, // Q-040
    idMahasiswa: c.get("idPengguna"),
    isiPertanyaan: isi.trim(),
    waktuPengajuan: new Date().toISOString(),
  });

  return c.json({ ok: true, idPertanyaan }, 201);
});

/**
 * Administrator — submitted questions, newest first (M9 B.1 no. 11).
 * `?q=` matches the question text or the student's name; `?sejak=`/`?sampai=`
 * bound the submission time.
 */
questionRoutes.get("/", requireRole("administrator"), async (c) => {
  const pertanyaan = await daftarPertanyaan(c.get("db"), {
    q: c.req.query("q"),
    sejak: c.req.query("sejak"),
    sampai: c.req.query("sampai"),
  });
  return c.json({ pertanyaan });
});

/** Administrator — delete one submitted question (M9 B.1 no. 11). */
questionRoutes.delete("/:id", requireRole("administrator"), async (c) => {
  const idPertanyaan = c.req.param("id");
  const hasil = await hapusPertanyaan(c.get("db"), idPertanyaan);
  if ((hasil.meta?.changes ?? 0) === 0) throw tidakDitemukan("Pertanyaan tidak ditemukan");
  return c.json({ ok: true, idPertanyaan });
});
