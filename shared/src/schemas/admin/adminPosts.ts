import * as v from "valibot";
import { nanoidString, positiveInteger, trimmedString } from "../types.js";

const adminPostsSchema = v.array(
  v.object({
    id: nanoidString,
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
