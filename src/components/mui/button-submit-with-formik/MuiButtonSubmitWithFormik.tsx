import { useFormikContext } from "formik";
import {
  Button,
  ButtonProps,
  CircularProgress,
  SxProps,
  Theme,
} from "@mui/material";

import * as React from "react";
import { ActionStatus } from "../../../interfaces/generalInterf";

const MuiButtonSubmitWithFormik = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps & { disableOnSubmitting?: boolean }, "onClick" | "type"> & {
    sx?: SxProps<Theme>;
    actionStatus?: ActionStatus;
  }
>(
  (
    { disableOnSubmitting = true, sx = [], children, actionStatus, ...props },
    ref
  ) => {
    const { isSubmitting, isValid } = useFormikContext();

    return (
      <Button
        sx={[...(Array.isArray(sx) ? sx : [sx])]}
        {...props}
        type="submit"
        ref={ref}
        disabled={(false && !isValid) || (disableOnSubmitting && isSubmitting)}
      >
        {actionStatus === "PROCESSING" && (
          <CircularProgress size={24} sx={{ mr: "0.5rem" }} />
        )}
        {children}
      </Button>
    );
  }
);

export default MuiButtonSubmitWithFormik;
