import * as v from "valibot";
import { nanoidString, positiveInteger, trimmedString } from "../types.js";

const adminSubmitPostSchema = v.object({
  authorId: nanoidString,
  timestamp: positiveInteger,
  caption: trimmedString,
  reactions: positiveInteger,
});

export type AdminSubmitPostInput = v.InferInput<typeof adminSubmitPostSchema>;

export function parseAdminSubmitPost(input: unknown) {
  return v.parse(adminSubmitPostSchema, input);
}
