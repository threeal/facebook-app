import * as v from "valibot";

import {
  integerToBoolean,
  nanoidString,
  positiveInteger,
  trimmedString,
} from "./types.js";

const postSchema = v.object({
  id: nanoidString,
  authorId: nanoidString,
  authorName: trimmedString,
  authorHasAvatar: integerToBoolean,
  timestamp: positiveInteger,
  caption: trimmedString,
  mediaType: v.nullable(v.union([v.literal("video"), v.literal("image")])),
  reactions: positiveInteger,
});

export type PostOutput = v.InferOutput<typeof postSchema>;

const postsSchema = v.array(postSchema);

export type PostsInput = v.InferInput<typeof postsSchema>;

export function parsePosts(input: unknown) {
  return v.parse(postsSchema, input);
}
