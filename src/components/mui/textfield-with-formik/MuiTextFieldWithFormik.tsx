import { useField, FieldHookConfig } from "formik";
import { TextField, TextFieldProps } from "@mui/material";
import * as React from "react";

const MuiTextFieldWithFormik = React.forwardRef<
  HTMLInputElement,
  Omit<TextFieldProps, "error" | "helperText"> & FieldHookConfig<any>
>((props, ref) => {
  const [field, meta] = useField(props);

  return (
    <TextField
      {...field}
      {...props}
      ref={ref}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
    />
  );
});

export default MuiTextFieldWithFormik;
