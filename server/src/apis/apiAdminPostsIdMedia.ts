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

export function apiAdminPostsIdMediaRoute(fastify: FastifyInstance) {
  fastify.post<{
    Params: { id: string };
  }>("/api/admin/posts/:id/media", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;

    const data = await request.file();
    if (!data) throw httpErrors.BadRequest();

    const ext = path.extname(data.filename);
    const oriFile = `data/static/posts/medias/${id}/original${ext}`;

    await mkdir(path.dirname(oriFile));
    await pump(data.file, createWriteStream(oriFile));

    if (data.mimetype.startsWith("image/")) {
      const webpFile = `data/static/posts/medias/${id}/390.webp`;
      const magick = spawn("magick", [
        oriFile,
        "-auto-orient",
        "-resize",
        "1170x",
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
        .updateTable("posts")
        .set({ media_type: "image" })
        .where("id", "=", id)
        .execute();
    } else if (data.mimetype.startsWith("video/")) {
      const webmFile = `data/static/posts/medias/${id}/390.webm`;
      const ffmpeg = spawn("ffmpeg", [
        "-i",
        oriFile,
        "-c:v",
        "libvpx",
        "-b:v",
        "1M",
        "-c:a",
        "libvorbis",
        webmFile,
      ]);
      await waitProcess(ffmpeg);

      await db
        .updateTable("posts")
        .set({ media_type: "video" })
        .where("id", "=", id)
        .execute();
    } else {
      throw httpErrors.BadRequest();
    }
  });

  fastify.delete<{
    Params: { id: string };
  }>("/api/admin/posts/:id/media", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;

    await rm(`data/static/posts/medias/${id}`, {
      recursive: true,
      force: true,
    });

    await db
      .updateTable("posts")
      .set({ media_type: null })
      .where("id", "=", id)
      .execute();
  });
}
