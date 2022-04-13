export function isString(value: any): value is string {
  return value.constructor === String;
}

export type ActionIdle = "IDLE";
export type ActionProcessing = "PROCESSING";
export type ActionFailed = "FAILED";
export type ActionSucceeded = "SUCCEEDED";

// export const ACTION_IDLE: ActionIdle = "IDLE";
// export const ACTION_PROCESSING: ActionProcessing = "PROCESSING";
// export const ACTION_FAILED: ActionFailed = "FAILED";
// export const ACTION_SUCCESS: ActionSucceeded = "SUCCEEDED";

export type ActionStatus =
  | ActionIdle
  | ActionProcessing
  | ActionFailed
  | ActionSucceeded;

export type OrNull<Type> = Type | null;

export type OrUndefined<Type> = Type | undefined;
export type OrNullUndefined<Type> = Type | null | undefined;

export type OneOrMany<Type> = Type | Type[];

export type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;

export type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
