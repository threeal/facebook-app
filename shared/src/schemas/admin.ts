import * as v from "valibot";

export const rawUserSchema = v.object({
  id: v.number(),
  name: v.string(),
  avatar: v.string(),
});

export const rawUsersSchema = v.array(rawUserSchema);

export type RawUserSchema = v.InferInput<typeof rawUserSchema>;

export const rawPostSchema = v.object({
  id: v.number(),
  authorName: v.string(),
  caption: v.nullable(v.string()),
  image: v.nullable(v.string()),
  video: v.nullable(v.string()),
  reactions: v.number(),
  date: v.string(),
});

export const rawPostsSchema = v.array(rawPostSchema);

export type RawPostSchema = v.InferInput<typeof rawPostSchema>;
