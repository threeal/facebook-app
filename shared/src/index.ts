import * as v from "valibot";

export const postSchema = v.object({
  author: v.object({
    name: v.string(),
    avatar: v.string(),
  }),
  caption: v.optional(v.string()),
  image: v.optional(v.string()),
  video: v.optional(v.string()),
  reactions: v.optional(v.number()),
  date: v.string(),
});

export type PostSchema = v.InferInput<typeof postSchema>;
