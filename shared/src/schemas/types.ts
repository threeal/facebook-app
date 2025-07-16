import * as v from "valibot";

export const trimmedString = v.pipe(v.string(), v.trim());

export const positiveInteger = v.pipe(
  v.number(),
  v.finite(),
  v.integer(),
  v.minValue(0),
);
