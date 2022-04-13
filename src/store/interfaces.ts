import { TrainingsFromApi } from "../interfaces/trainingsInterf";

import { AnyAction, AsyncThunk, PayloadAction } from "@reduxjs/toolkit";

type GenericAsyncThunk = AsyncThunk<unknown, unknown, {}>;

type AsyncThunkWithReturnValue = AsyncThunk<TrainingsFromApi, unknown, any>;

type GenericAsyncThunkWithAbort = AsyncThunk<
  unknown,
  unknown,
  {
    rejectValue: "aborted";
  }
>;

export type GenericPendingAction = ReturnType<GenericAsyncThunk["pending"]>;
export type GenericRejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
export type FulfilledAction = ReturnType<
  AsyncThunkWithReturnValue["fulfilled"]
>;

export type GenericRejectedActionWithAbort = ReturnType<
  GenericAsyncThunkWithAbort["rejected"]
>;

export function isGenericPendingAction(
  action: AnyAction
): action is GenericPendingAction {
  return action.type.endsWith("/pending");
}

export function isFulfilledAction(
  action: AnyAction
): action is FulfilledAction {
  return action.type.endsWith("/fulfilled");
}
export function isPendingAction(action: AnyAction): action is FulfilledAction {
  return action.type.endsWith("/pending");
}

export function isGenericRejectedActionWithNoPayload(
  action: AnyAction
): action is GenericRejectedAction {
  return action.type.endsWith("/rejected") && !action.payload;
}

export function isGenericRejectedActionWithRejectWithValueReason(
  action: AnyAction
): action is GenericRejectedAction {
  return action.type.endsWith("/rejected") && action.payload === "reason";
}

type PayloadReason = "Reason";

export function isWithPayloadReason(
  action: AnyAction
): action is PayloadAction<PayloadReason> {
  return action.payload === "Reason";
}
