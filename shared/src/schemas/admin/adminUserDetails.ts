import * as v from "valibot";
import { integerToBoolean, trimmedString } from "../types.js";

const adminUserDetailsSchema = v.object({
  name: trimmedString,
  hasAvatar: integerToBoolean,
});

export type AdminUserDetailsInput = v.InferInput<typeof adminUserDetailsSchema>;

export function parseAdminUserDetails(input: unknown) {
  return v.parse(adminUserDetailsSchema, input);
}
