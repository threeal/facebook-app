import * as v from "valibot";

export const rawUserSchema = v.object({
  id: v.number(),
  name: v.string(),
  avatar: v.string(),
});

export const rawUsersSchema = v.array(rawUserSchema);

export type RawUserSchema = v.InferInput<typeof rawUserSchema>;
