import { createAsyncThunk } from "@reduxjs/toolkit";
import { ExtraArgument } from "../../store";
import { User } from "../../../interfaces/authInterf";
import {
  DataFromApi_ValidationErrors,
  resWithUser,
  resWithValidationErrors,
} from "../../../api/authApi";

interface AuthenticateUserThunkProps {
  email: string;
  password: string;
  registerMode?: boolean;
}

const authenticateUser = createAsyncThunk<
  User,
  AuthenticateUserThunkProps,
  {
    rejectValue: DataFromApi_ValidationErrors;
    extra: ExtraArgument;
  }
>("auth/login", async ({ email, password }, { rejectWithValue, extra }) => {
  try {
    const res = await extra.api.auth.authenticate(email, password);

    if (res.ok && resWithUser(res)) {
      return res.body.user;
    } else if (res.status === 401 && resWithValidationErrors(res)) {
      return rejectWithValue(res.body);
    } else {
      throw new Error("Unexpected response during User authentication");
    }
  } catch (error) {
    throw error;
  }
});

export { authenticateUser };
