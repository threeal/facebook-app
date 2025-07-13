import * as v from "valibot";

export const postSchema = v.object({
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

export type PostSchema = v.InferInput<typeof postSchema>;
