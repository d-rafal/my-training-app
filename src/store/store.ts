import { configureStore } from "@reduxjs/toolkit";
import trainingsReducer from "./features/trainings/trainingsSlice";
import authReducer from "./features/auth/authSlice";

import api, { AppApi } from "../api";
export interface ExtraArgument {
  api: AppApi;
}

const extraArgument: ExtraArgument = { api };

const store = configureStore({
  reducer: {
    auth: authReducer,
    trainings: trainingsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: extraArgument,
      },
    }),
});

export type AppReduxDispatch = typeof store.dispatch;
export type AppReduxGetState = typeof store.getState;
export type RootState = ReturnType<AppReduxGetState>;

export default store;
