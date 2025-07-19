import * as v from "valibot";
import { nanoidString } from "../types.js";

const adminCreateResultSchema = v.object({
  id: nanoidString,
});

export type AdminCreateResultInput = v.InferInput<
  typeof adminCreateResultSchema
>;

export function parseAdminCreatetResult(input: unknown) {
  return v.parse(adminCreateResultSchema, input);
}
