import * as v from "valibot";
import { nanoidString } from "../types.js";

const adminCreatePostResultSchema = v.object({
  id: nanoidString,
});

export type AdminCreatePostResultInput = v.InferInput<
  typeof adminCreatePostResultSchema
>;

export function parseAdminCreatetPostResult(input: unknown) {
  return v.parse(adminCreatePostResultSchema, input);
}
