import { FastifyInstance, FastifyRequest } from "fastify";
import httpErrors from "http-errors";
import { nanoid } from "nanoid";
import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

import {
  AdminCreatePostResultInput,
  AdminPostDetailsInput,
  AdminPostsInput,
  AdminUsersInput,
  parseAdminCreatetPostResult,
  parseAdminPostDetails,
  parseAdminPosts,
  parseAdminSubmitPost,
  parseAdminUsers,
} from "shared";

import { db } from "../db.js";
import { waitProcess } from "../utils/process.js";

const pump = promisify(pipeline);

export default function adminApiRoute(fastify: FastifyInstance) {
  const assertAdminSecret = (request: FastifyRequest) => {
    const adminSecret = request.headers["admin-secret"];
    if (adminSecret !== process.env.ADMIN_SECRET) {
      throw httpErrors.Unauthorized();
    }
  };

  fastify.post("/api/admin/verify", (request): null => {
    assertAdminSecret(request);
    return null;
  });

  fastify.get("/api/admin/users", async (request) => {
    assertAdminSecret(request);
    const rows: AdminUsersInput = await db
      .selectFrom("users")
      .select(["id", "name", "has_avatar as hasAvatar"])
      .execute();

    return parseAdminUsers(rows);
  });

  fastify.get("/api/admin/posts", async (request) => {
    assertAdminSecret(request);
    const rows: AdminPostsInput = await db
      .selectFrom("posts")
      .innerJoin("users", "posts.author_id", "users.id")
      .select([
        "posts.id",
        "users.name as authorName",
        "posts.timestamp",
        "posts.caption",
        "posts.media_type as mediaType",
        "posts.reactions",
      ])
      .execute();

    return parseAdminPosts(rows);
  });

  fastify.post("/api/admin/posts", async (request) => {
    assertAdminSecret(request);
    const post = parseAdminSubmitPost(request.body);
    const row: AdminCreatePostResultInput = await db
      .insertInto("posts")
      .values({
        id: nanoid(),
        author_id: post.authorId,
        timestamp: post.timestamp,
        caption: post.caption,
        media_type: null,
        reactions: post.reactions,
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    return parseAdminCreatetPostResult(row);
  });

  fastify.get<{
    Params: { id: string };
  }>("/api/admin/posts/:id", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;
    const rows: AdminPostDetailsInput = await db
      .selectFrom("posts")
      .innerJoin("users", "posts.author_id", "users.id")
      .select([
        "posts.id",
        "users.id as authorId",
        "posts.timestamp",
        "posts.caption",
        "posts.media_type as mediaType",
        "posts.reactions",
      ])
      .where("posts.id", "=", id)
      .executeTakeFirstOrThrow();

    return parseAdminPostDetails(rows);
  });

  fastify.put<{
    Params: { id: string };
  }>("/api/admin/posts/:id", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;
    const post = parseAdminSubmitPost(request.body);
    await db
      .updateTable("posts")
      .set({
        author_id: post.authorId,
        timestamp: post.timestamp,
        caption: post.caption,
        reactions: post.reactions,
      })
      .where("id", "=", id)
      .execute();
  });

  fastify.delete<{
    Params: { id: string };
  }>("/api/admin/posts/:id", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;

    await rm(`data/static/posts/medias/${id}`, {
      recursive: true,
      force: true,
    });

    await db.deleteFrom("posts").where("id", "=", id).execute();
  });

  fastify.post<{
    Params: { id: string };
  }>("/api/admin/posts/:id/media", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;

    const data = await request.file();
    if (!data) throw httpErrors.BadRequest();

    const ext = path.extname(data.filename);
    const oriFile = `data/static/posts/medias/${id}/original.${ext}`;

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
