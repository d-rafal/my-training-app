import { IdFromApi } from "./commonInterf";
import { ActionStatus, OrNull } from "./generalInterf";

export interface User {
  readonly _id?: IdFromApi;
  readonly name: string;
  readonly email: string;
}
export interface AuthState {
  readonly actionStatus: ActionStatus;
  readonly error: OrNull<string>;
  readonly currentRequestId: OrNull<string>;
  readonly user: OrNull<User>;
}
