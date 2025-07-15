import * as v from "valibot";

const rawUserSchema = v.object({
  id: v.number(),
  name: v.string(),
});

const rawUsersSchema = v.array(rawUserSchema);

export type RawUserSchema = v.InferInput<typeof rawUserSchema>;

export function parseRawUsersSchema(data: unknown) {
  return v.parse(rawUsersSchema, data);
}

const rawPostSchema = v.object({
  id: v.number(),
  authorName: v.string(),
  timestamp: v.number(),
  caption: v.nullable(v.string()),
  mediaType: v.nullable(v.union([v.literal("video"), v.literal("image")])),
  reactions: v.number(),
});

const rawPostsSchema = v.array(rawPostSchema);

export type RawPostSchema = v.InferInput<typeof rawPostSchema>;

export function parseRawPostSchema(data: unknown) {
  return v.parse(rawPostsSchema, data);
}
