import * as v from "valibot";
import { positiveInteger, trimmedString } from "./types.js";

const postSchema = v.object({
  id: positiveInteger,
  authorId: positiveInteger,
  authorName: trimmedString,
  timestamp: positiveInteger,
  caption: trimmedString,
  mediaType: v.nullable(v.union([v.literal("video"), v.literal("image")])),
  reactions: positiveInteger,
});

const postsSchema = v.array(postSchema);

export type PostSchema = v.InferInput<typeof postSchema>;

export function parsePostsSchema(data: unknown) {
  return v.parse(postsSchema, data);
}
