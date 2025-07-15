import * as v from "valibot";

const rawUserSchema = v.object({
  id: v.number(),
  name: v.string(),
  avatar: v.string(),
});

const rawUsersSchema = v.array(rawUserSchema);

export type RawUserSchema = v.InferInput<typeof rawUserSchema>;

export function parseRawUsersSchema(data: unknown) {
  return v.parse(rawUsersSchema, data);
}

const rawPostSchema = v.object({
  id: v.number(),
  authorName: v.string(),
  caption: v.nullable(v.string()),
  image: v.nullable(v.string()),
  video: v.nullable(v.string()),
  reactions: v.number(),
  date: v.string(),
});

const rawPostsSchema = v.array(rawPostSchema);

export type RawPostSchema = v.InferInput<typeof rawPostSchema>;

export function parseRawPostSchema(data: unknown) {
  return v.parse(rawPostsSchema, data);
}
