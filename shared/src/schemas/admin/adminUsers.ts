import * as v from "valibot";
import { integerToBoolean, nanoidString, trimmedString } from "../types.js";

const adminUsersSchema = v.array(
  v.object({
    id: nanoidString,
    name: trimmedString,
    hasAvatar: integerToBoolean,
  }),
);

export type AdminUsersInput = v.InferInput<typeof adminUsersSchema>;

export function parseAdminUsers(input: unknown) {
  return v.parse(adminUsersSchema, input);
}
