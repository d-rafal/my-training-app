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
import { IconButton, InputAdornment, BaseTextFieldProps } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Field,
  Form,
  Formik,
  FieldProps,
  FieldInputProps,
  FieldMetaProps,
} from "formik";
import * as Yup from "yup";
import MuiButtonSubmitWithFormik from "../../components/mui/button-submit-with-formik/MuiButtonSubmitWithFormik";

import { selectActionStatus } from "../../store/features/auth/authSlice";
import { useSetSnackbarContext } from "../../components/snackbar-provider/SnackbarProvider";
import { ObjectShape } from "yup/lib/object";

interface FormikValuesType {
  email: string;
  password: string;
  "remember-me": boolean;
}

type FormikValuesTypeForYup = {
  [Property in keyof FormikValuesType]+?: ObjectShape[string];
};

const validationSchema = Yup.object<FormikValuesTypeForYup>({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Must be more then 5 characters")
    .required("Required"),
});

export const MuiTextFieldPropsFromFormikField = (
  field: FieldInputProps<any>,
  meta: FieldMetaProps<any>,
  defaultHelperText = " "
): BaseTextFieldProps => {
  return {
    ...field,
    error: meta.touched && meta.error !== undefined,
    helperText: meta.touched && meta.error ? meta.error : defaultHelperText, // " " żeby wysokośc pola sie nie zmieniała jak bedzie error
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

  let from = "/";
  if (isLocationStateWithFrom(location.state) && location.state.from.pathname) {
    from = location.state.from.pathname;

    if (location.state.from.search) {
      from += location.state.from.search;
    }
  }

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

          <Formik<FormikValuesType>
            initialValues={{
              email: "",
              password: "",
              "remember-me": false,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              // protection against submitting form twice
              if (!requestInProgress.current) {
                requestInProgress.current = true;

                try {
                  const resultAction = await dispatch(
                    authenticateUser({
                      email: values.email,
                      password: values.password,
                    })
                  );

                  if (authenticateUser.fulfilled.match(resultAction)) {
                    navigate(from, { replace: true });
                  } else if (resultAction.payload) {
                    if (resultAction.payload.errors.errorEmail) {
                      actions.setFieldError(
                        "email",
                        resultAction.payload.errors.errorEmail
                      );
                    } else if (resultAction.payload.errors.errorPassword) {
                      actions.setFieldError(
                        "password",
                        resultAction.payload.errors.errorPassword
                      );
                    }
                  } else {
                    setSnackbar(
                      "Error during authentication",
                      "error",
                      undefined,
                      true
                    );
                  }
                } finally {
                  requestInProgress.current = false;
                  actions.setSubmitting(false);
                }
              }
            }}
          >
            <Box sx={{ mt: "1rem", width: "100%" }}>
              <Form noValidate>
                <Field name="email">
                  {({ field, form, meta }: FieldProps) => (
                    <TextField
                      id="email"
                      {...MuiTextFieldPropsFromFormikField(field, meta)}
                      margin="normal"
                      required
                      fullWidth
                      label="Email Address"
                      type="email"
                      autoComplete="email"
                      autoFocus
                    />
                  )}
                </Field>

                <Field name="password">
                  {({ field, form, meta }: FieldProps) => (
                    <TextField
                      id="password"
                      {...MuiTextFieldPropsFromFormikField(field, meta)}
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
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Field>

                <Field name="remember-me" type="checkbox">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControlLabel
                      {...(meta.touched && meta.error
                        ? {
                            componentsProps: { typography: { color: "error" } },
                          }
                        : null)}
                      control={<Checkbox {...field} />}
                      label={"Remember me"}
                    />
                  )}
                </Field>

                <MuiButtonSubmitWithFormik
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  actionStatus={actionStatus}
                >
                  Sign In
                </MuiButtonSubmitWithFormik>
              </Form>
            </Box>
          </Formik>

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
