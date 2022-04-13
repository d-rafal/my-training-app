import { CaseReducer, createSlice } from "@reduxjs/toolkit";
import { AuthState, User } from "../../../interfaces/authInterf";
import { OrNull } from "../../../interfaces/generalInterf";
import { useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store";
import { authenticateUser } from "./authActionsCreators";

const initialUserState = (userInitialState: OrNull<User>): OrNull<User> => {
  let userLocalStorageState_JSON = localStorage.getItem("user");
  let userLocalStorageState: OrNull<User> = null;

  if (userLocalStorageState_JSON)
    userLocalStorageState = JSON.parse(userLocalStorageState_JSON);

  return userLocalStorageState ? userLocalStorageState : userInitialState;
};

const authInitialState = {
  actionStatus: "IDLE",
  error: null,
  currentRequestId: null,
  user: initialUserState(null),
} as AuthState;

export const useSelectUser = () => useAppSelector((state) => state.auth.user);
export const selectActionStatus = (state: RootState) => state.auth.actionStatus;
export const selectError = (state: RootState) => state.auth.error;

const actionStarted: CaseReducer<AuthState> = (state) => {
  state.actionStatus = "PROCESSING";
  state.error = null;
  state.user = null;
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    logoutRequestStarted: actionStarted,
    userLoggedOut(state) {
      state.actionStatus = "IDLE";
      state.error = null;
      state.user = null;
    },
    logoutRequestFailed: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state, action) => {
        state.actionStatus = "PROCESSING";
        state.currentRequestId = action.meta.requestId;
        state.error = null;
        state.user = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.actionStatus = "IDLE";
        state.currentRequestId = null;
        state.user = action.payload;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.currentRequestId = null;
        state.user = null;

        if (action.payload) {
          state.actionStatus = "IDLE";
        } else {
          state.actionStatus = "FAILED";

          state.error = action.error.message
            ? action.error.message
            : "Error in authentication!";
        }
      })
      // default case
      .addDefaultCase((state, action) => {});
  },
});

export const { logoutRequestStarted, userLoggedOut, logoutRequestFailed } =
  authSlice.actions;

export default authSlice.reducer;
