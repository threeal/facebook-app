import * as v from "valibot";
import { integerToBoolean, positiveInteger, trimmedString } from "./types.js";

const adminUsersSchema = v.array(
  v.object({
    id: positiveInteger,
    name: trimmedString,
    hasAvatar: integerToBoolean,
  }),
);

export type AdminUsersInput = v.InferInput<typeof adminUsersSchema>;

export function parseAdminUsers(input: unknown) {
  return v.parse(adminUsersSchema, input);
}

const adminPostsSchema = v.array(
  v.object({
    id: positiveInteger,
    authorName: trimmedString,
    timestamp: positiveInteger,
    caption: trimmedString,
    mediaType: v.nullable(v.union([v.literal("video"), v.literal("image")])),
    reactions: positiveInteger,
  }),
);

export type AdminPostsInput = v.InferInput<typeof adminPostsSchema>;

export function parseAdminPosts(input: unknown) {
  return v.parse(adminPostsSchema, input);
}

const adminCreatePostSchema = v.object({
  authorId: positiveInteger,
  timestamp: positiveInteger,
  caption: trimmedString,
  reactions: positiveInteger,
});

export type AdminCreatePostInput = v.InferInput<typeof adminCreatePostSchema>;

export function parseAdminCreatePost(input: unknown) {
  return v.parse(adminCreatePostSchema, input);
}
