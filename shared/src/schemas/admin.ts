import * as v from "valibot";
import { integerToBoolean, positiveInteger, trimmedString } from "./types.js";

const adminUserSchema = v.object({
  id: positiveInteger,
  name: trimmedString,
  hasAvatar: integerToBoolean,
});

const adminUsersSchema = v.array(adminUserSchema);

export type AdminUserSchema = v.InferInput<typeof adminUserSchema>;

export function parseAdminUsersSchema(data: unknown) {
  return v.parse(adminUsersSchema, data);
}

const adminPostSchema = v.object({
  id: positiveInteger,
  authorName: trimmedString,
  timestamp: positiveInteger,
  caption: trimmedString,
  mediaType: v.nullable(v.union([v.literal("video"), v.literal("image")])),
  reactions: positiveInteger,
});

const adminPostsSchema = v.array(adminPostSchema);

export type AdminPostSchema = v.InferInput<typeof adminPostSchema>;

export function parseAdminPostSchema(data: unknown) {
  return v.parse(adminPostsSchema, data);
}

const adminCreatePostSchema = v.object({
  authorId: positiveInteger,
  timestamp: positiveInteger,
  caption: trimmedString,
  reactions: positiveInteger,
});

export type AdminCreatePostSchema = v.InferInput<typeof adminCreatePostSchema>;

export function parseAdminCreatePostSchema(data: unknown) {
  return v.parse(adminCreatePostSchema, data);
}
