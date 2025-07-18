import * as v from "valibot";
import { nanoidString, positiveInteger, trimmedString } from "../types.js";

const adminPostDetailsSchema = v.object({
  id: nanoidString,
  authorId: nanoidString,
  timestamp: positiveInteger,
  caption: trimmedString,
  mediaType: v.nullable(v.union([v.literal("video"), v.literal("image")])),
  reactions: positiveInteger,
});

export type AdminPostDetailsInput = v.InferInput<typeof adminPostDetailsSchema>;

export function parseAdminPostDetails(input: unknown) {
  return v.parse(adminPostDetailsSchema, input);
}
