import { User } from "../interfaces/authInterf";
import {
  dataCheckerNullOrUndefined,
  fetchData,
  FetchDataReturnValue,
} from "./requests";
export interface DataFromApi_User {
  user: User;
}
export interface DataFromApi_ValidationErrors {
  errors: { errorEmail?: string; errorPassword?: string };
}

export const resWithUser = (
  data: any
): data is FetchDataReturnValue<DataFromApi_User> => {
  return data.body.user;
};

export const resWithValidationErrors = (
  data: any
): data is FetchDataReturnValue<DataFromApi_ValidationErrors> => {
  return data.body.errors?.errorEmail || data.body.errors?.errorPassword;
};

const authenticate_api = async (email: string, password: string) => {
  return fetchData(
    "/login",
    "POST",
    JSON.stringify({ email, password }),
    undefined,
    undefined,
    dataCheckerNullOrUndefined
  ) as Promise<
    FetchDataReturnValue<DataFromApi_User | DataFromApi_ValidationErrors>
  >;
};

const register_api = async (email: string, password: string) => {
  return fetchData(
    "/signup",
    "POST",
    JSON.stringify({ email, password }),
    undefined,
    undefined,
    dataCheckerNullOrUndefined
  ) as Promise<FetchDataReturnValue<DataFromApi_User>>;
};

const authApi = {
  authenticate: authenticate_api,
  register: register_api,
};

export default authApi;
