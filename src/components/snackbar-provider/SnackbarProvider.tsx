import { Alert, AlertColor, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import createCtx from "../../auxiliary/createCtx";

import { nanoid } from "@reduxjs/toolkit";
import { useSelectActionStatusAndError } from "../../store/features/trainings/trainingsSlice";

const [useSetSnackbarContext, SetSnackbarContextProvider] =
  createCtx<
    (
      message: string,
      type: AlertColor,
      autoHideDuration?: number,
      switchOffAutoHide?: boolean
    ) => void
  >("SetSnackbarContext");

export interface SnackbarMessage {
  message: string;
  key: string;
  type: AlertColor;
  autoHideDuration: number;
  switchOffAutoHide: boolean;
}

export interface State {
  open: boolean;
  snackPack: readonly SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}

const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(
    undefined
  );

  const [actionStatus, error] = useSelectActionStatusAndError();

  const setSnackbar = (
    message: string,
    type: AlertColor,
    autoHideDuration = 2000,
    switchOffAutoHide = false
  ) => {
    setSnackPack((prev) => [
      ...prev,
      { message, key: nanoid(), type, autoHideDuration, switchOffAutoHide },
    ]);
  };

  useEffect(() => {
    if (actionStatus === "FAILED") {
      setSnackbar(
        error ? error : "Error during operation occurred",
        "error",
        undefined,
        true
      );
    }
  }, [actionStatus, error]);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <SetSnackbarContextProvider value={setSnackbar}>
      {children}
      <Snackbar
        key={messageInfo?.key}
        open={open}
        {...(messageInfo?.switchOffAutoHide
          ? null
          : { autoHideDuration: messageInfo?.autoHideDuration })}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
      >
        <Alert
          onClose={handleClose}
          severity={messageInfo?.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {messageInfo ? messageInfo.message : undefined}
        </Alert>
      </Snackbar>
    </SetSnackbarContextProvider>
  );
};

export { useSetSnackbarContext };
export default SnackbarProvider;
