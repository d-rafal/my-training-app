import { useField, FieldHookConfig } from "formik";
import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
} from "@mui/material";
import * as React from "react";

const MuiTextCheckboxWithFormik = React.forwardRef<
  HTMLButtonElement,
  Pick<FormControlLabelProps, "label"> &
    Partial<Pick<FormControlLabelProps, "labelPlacement">> & {
      required?: boolean;
    } & Omit<FieldHookConfig<any>, "type">
>((props, ref) => {
  const [field, meta] = useField({
    ...props,
    type: "checkbox",
  } as FieldHookConfig<any>);

  const { required, label, labelPlacement } = props;

  return (
    <FormControlLabel
      ref={ref}
      {...(meta.touched && meta.error
        ? { componentsProps: { typography: { color: "error" } } }
        : null)}
      control={<Checkbox ref={ref} required={!!required} {...field} />}
      label={label + (meta.error ? meta.error : "")}
      {...(labelPlacement ? { labelPlacement: labelPlacement } : null)}
    />
  );
});

export default MuiTextCheckboxWithFormik;
