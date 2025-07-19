import { FastifyInstance } from "fastify";
import httpErrors from "http-errors";
import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { db } from "../db.js";
import { assertAdminSecret } from "../utils/admin.js";
import { waitProcess } from "../utils/process.js";

const pump = promisify(pipeline);

export function apiAdminUsersIdAvatarRoute(fastify: FastifyInstance) {
  fastify.post<{
    Params: { id: string };
  }>("/api/admin/users/:id/avatar", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;

    const data = await request.file();
    if (!data?.mimetype.startsWith("image/")) {
      throw httpErrors.BadRequest();
    }

    const ext = path.extname(data.filename);
    const oriFile = `data/static/users/avatars/${id}/original${ext}`;

    await mkdir(path.dirname(oriFile));
    await pump(data.file, createWriteStream(oriFile));

    const webpFile = `data/static/users/avatars/${id}/40x40.webp`;
    const magick = spawn("magick", [
      oriFile,
      "-auto-orient",
      "-resize",
      "120x120!",
      "-filter",
      "Lanczos",
      "-define",
      "filter:blur=0.8",
      "-sharpen",
      "0x0.8",
      webpFile,
    ]);
    await waitProcess(magick);

    await db
      .updateTable("users")
      .set({ has_avatar: 1 })
      .where("id", "=", id)
      .execute();
  });

  fastify.delete<{
    Params: { id: string };
  }>("/api/admin/users/:id/avatar", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;

    await rm(`data/static/users/avatars/${id}`, {
      recursive: true,
      force: true,
    });

    await db
      .updateTable("users")
      .set({ has_avatar: 0 })
      .where("id", "=", id)
      .execute();
  });
}
