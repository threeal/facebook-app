import * as v from "valibot";

const postSchema = v.object({
  id: v.number(),
  authorId: v.number(),
  authorName: v.string(),
  timestamp: v.number(),
  caption: v.string(),
  mediaType: v.nullable(v.union([v.literal("video"), v.literal("image")])),
  reactions: v.number(),
});

const postsSchema = v.array(postSchema);

export type PostSchema = v.InferInput<typeof postSchema>;

export function parsePostsSchema(data: unknown) {
  return v.parse(postsSchema, data);
}
