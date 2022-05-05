import Avatar from "@mui/material/Avatar";

import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

import sideImg from "../../img/login-side-v8.png";
import Copyright from "./Copyright";
import { useRef, useState } from "react";
import { authenticateUser } from "../../store/features/auth/authActionsCreators";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import {
  IconButton,
  InputAdornment,
  CircularProgress,
  Button,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import * as Yup from "yup";

import { selectActionStatus } from "../../store/features/auth/authSlice";
import { useSetSnackbarContext } from "../../components/snackbar-provider/SnackbarProvider";
import { ObjectShape } from "yup/lib/object";
import {
  useForm,
  Controller,
  ControllerRenderProps,
  ControllerFieldState,
  SubmitHandler,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface FormDataType {
  email: string;
  password: string;
  "remember-me": boolean;
}

type FormDataTypeForYup = {
  [Property in keyof FormDataType]+?: ObjectShape[string];
};

const validationSchema = Yup.object<FormDataTypeForYup>({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Must be more then 5 characters")
    .required("Required"),
});

export const MuiTextFieldPropsError = (
  field: ControllerRenderProps<any, any>,
  fieldState: ControllerFieldState,
  defaultHelperText = " "
) => {
  return {
    name: field.name,
    value: field.value,
    onChange: field.onChange,
    onBlur: field.onBlur,
    inputRef: field.ref,
    error: fieldState.invalid,
    helperText: fieldState.invalid
      ? fieldState.error?.message
      : defaultHelperText,
  };
};

interface LocationStateWithFrom {
  from: Location;
}

const isLocationStateWithFrom = (
  value: any
): value is LocationStateWithFrom => {
  return value?.from;
};

const AuthSide = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const actionStatus = useAppSelector(selectActionStatus);
  const setSnackbar = useSetSnackbarContext();

  const requestInProgress = useRef(false);

  const {
    handleSubmit,
    control,
    setError,
    formState: { isValid, isSubmitting, submitCount },
  } = useForm<FormDataType>({
    defaultValues: {
      email: "",
      password: "",
      "remember-me": false,
    },
    mode: "all",
    criteriaMode: "firstError",
    resolver: yupResolver(validationSchema),
    shouldUnregister: true,
  });

  let from = "/";
  if (isLocationStateWithFrom(location.state) && location.state.from.pathname) {
    from = location.state.from.pathname;

    if (location.state.from.search) {
      from += location.state.from.search;
    }
  }

  const onSubmit: SubmitHandler<FormDataType> = async (data) => {
    // protection against submitting form twice
    if (!requestInProgress.current) {
      requestInProgress.current = true;

      try {
        const resultAction = await dispatch(
          authenticateUser({
            email: data.email,
            password: data.password,
          })
        );

        if (authenticateUser.fulfilled.match(resultAction)) {
          navigate(from, { replace: true });
        } else if (resultAction.payload) {
          if (resultAction.payload.errors.errorEmail) {
            setError("email", {
              type: "from server",
              message: resultAction.payload.errors.errorEmail,
            });
          } else if (resultAction.payload.errors.errorPassword) {
            setError("password", {
              type: "from server",
              message: resultAction.payload.errors.errorPassword,
            });
          }
        } else {
          setSnackbar("Error during authentication", "error", undefined, true);
        }
      } finally {
        requestInProgress.current = false;
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Grid container component="main" id="login-container">
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${sideImg})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 7,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box sx={{ mt: "1rem", width: "100%" }}>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Controller
                render={({ field, fieldState, formState }) => (
                  <TextField
                    id="email"
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    {...MuiTextFieldPropsError(field, fieldState)}
                  />
                )}
                name="email"
                control={control}
              />
              <Controller
                render={({ field, fieldState, formState }) => (
                  <TextField
                    id="password"
                    sx={{ minHeight: "5rem" }}
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    {...MuiTextFieldPropsError(field, fieldState)}
                  />
                )}
                name="password"
                control={control}
              />
              <Controller
                render={({ field, fieldState }) => (
                  <FormControlLabel
                    {...(fieldState.invalid
                      ? {
                          componentsProps: { typography: { color: "error" } },
                        }
                      : null)}
                    control={
                      <Checkbox
                        name={field.name}
                        onChange={(e) => field.onChange(e.target.checked)}
                        onBlur={field.onBlur}
                        checked={field.value}
                        inputRef={field.ref}
                      />
                    }
                    label={"Remember me"}
                  />
                )}
                name="remember-me"
                control={control}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={
                  isSubmitting ||
                  (submitCount && !isValid) ||
                  actionStatus === "PROCESSING"
                }
              >
                {actionStatus === "PROCESSING" && (
                  <CircularProgress size={24} sx={{ mr: "0.5rem" }} />
                )}
                Sign In
              </Button>
            </form>
          </Box>

          <Grid container>
            <Grid item xs sx={{ minWidth: "max-content" }}>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>

            <Grid item>
              <Link href="#" variant="body2">
                "Don't have an account? Sign Up"
              </Link>
            </Grid>
          </Grid>
          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthSide;
