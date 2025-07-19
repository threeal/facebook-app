import * as v from "valibot";
import { trimmedString } from "../types.js";

const adminSubmitUserSchema = v.object({
  name: trimmedString,
});

export type AdminSubmitUserInput = v.InferInput<typeof adminSubmitUserSchema>;

export function parseAdminSubmitUser(input: unknown) {
  return v.parse(adminSubmitUserSchema, input);
}
