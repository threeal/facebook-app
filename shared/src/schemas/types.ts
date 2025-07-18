import * as v from "valibot";

export const nanoidString = v.pipe(v.string(), v.nanoid());
export const trimmedString = v.pipe(v.string(), v.trim());

export const integer = v.pipe(v.number(), v.finite(), v.integer());
export const positiveInteger = v.pipe(integer, v.minValue(0));

export const integerToBoolean = v.union([
  v.boolean(),
  v.pipe(
    integer,
    v.transform((val) => val !== 0),
  ),
]);
