import * as v from "valibot";

const postSchema = v.object({
  author: v.object({
    name: v.string(),
    avatar: v.string(),
  }),
  caption: v.nullable(v.string()),
  image: v.nullable(v.string()),
  video: v.nullable(v.string()),
  reactions: v.number(),
  date: v.string(),
});

const postsSchema = v.array(postSchema);

export type PostSchema = v.InferInput<typeof postSchema>;

export function parsePostsSchema(data: unknown) {
  return v.parse(postsSchema, data);
}
