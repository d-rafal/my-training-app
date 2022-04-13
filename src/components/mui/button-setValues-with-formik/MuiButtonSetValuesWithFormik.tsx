import { useFormikContext } from "formik";
import { Button, ButtonProps } from "@mui/material";

import * as React from "react";

const MuiButtonSetValuesWithFormik = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps & { disableOnSubmitting?: boolean }, "onClick">
>(({ disableOnSubmitting = false, ...props }, ref) => {
  const { setValues, isSubmitting } = useFormikContext();

  return (
    <Button
      {...props}
      ref={ref}
      {...(disableOnSubmitting ? { disabled: isSubmitting } : null)}
      onClick={() => {
        setValues({
          email: "rafal@hddh.com",
          password: "testqqqq2",
          "remember-me-boolean": true,
          "remember-me-value": ["one", "two"],
        });
      }}
    />
  );
});

export default MuiButtonSetValuesWithFormik;
