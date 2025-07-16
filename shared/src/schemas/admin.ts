import * as v from "valibot";

const adminUserSchema = v.object({
  id: v.number(),
  name: v.string(),
});

const adminUsersSchema = v.array(adminUserSchema);

export type AdminUserSchema = v.InferInput<typeof adminUserSchema>;

export function parseAdminUsersSchema(data: unknown) {
  return v.parse(adminUsersSchema, data);
}

const adminPostSchema = v.object({
  id: v.number(),
  authorName: v.string(),
  timestamp: v.number(),
  caption: v.string(),
  mediaType: v.nullable(v.union([v.literal("video"), v.literal("image")])),
  reactions: v.number(),
});

const adminPostsSchema = v.array(adminPostSchema);

export type AdminPostSchema = v.InferInput<typeof adminPostSchema>;

export function parseAdminPostSchema(data: unknown) {
  return v.parse(adminPostsSchema, data);
}

const adminCreatePostSchema = v.object({
  authorId: v.number(),
  timestamp: v.number(),
  caption: v.string(),
  reactions: v.number(),
});

export type AdminCreatePostSchema = v.InferInput<typeof adminCreatePostSchema>;

export function parseAdminCreatePostSchema(data: unknown) {
  return v.parse(adminCreatePostSchema, data);
}
