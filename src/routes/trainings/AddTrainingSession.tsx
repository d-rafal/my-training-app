import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ActionStatus, OrNull } from "../../interfaces/generalInterf";
import { addTrainingSession } from "../../store/features/trainings/trainingsActionCreators";
import { useAppDispatch } from "../../store/hooks/hooks";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { commonDateValidation, DatePickerField } from "./FilterByDate";
import { MuiTextFieldPropsError } from "../auth/AuthSide";
import { useSelectActionStatusAndError } from "../../store/features/trainings/trainingsSlice";
import { useSetSnackbarContext } from "../../components/snackbar-provider/SnackbarProvider";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

const maxCommentSigns = 255;

interface FormDataType {
  date: OrNull<Date>;
  comment: "";
}

const AddTrainingSession = () => {
  const [actionStatus] = useSelectActionStatusAndError();

  const [, setAddRequestStatus] = useState<ActionStatus>("IDLE");

  const dispatch = useAppDispatch();
  const location = useLocation();
  const [addTrainingDialogOpen, setAddTrainingDialogOpen] = useState(false);
  const requestInProgress = useRef(false);

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<FormDataType>({
    defaultValues: {
      date: new Date(),
      comment: "",
    },
    mode: "all",
    criteriaMode: "firstError",
    shouldUnregister: true,
  });

  const setSnackbar = useSetSnackbarContext();

  const handleOpenAddTrainingDialog = () => {
    setAddTrainingDialogOpen(true);
  };

  const handleCloseAddTrainingDialog = () => {
    setAddTrainingDialogOpen(false);
  };

  const createTrainingSession = async (date: Date, comment: string) => {
    try {
      setAddRequestStatus("PROCESSING");

      await dispatch(
        addTrainingSession({
          trainingSession: { date: date.toISOString(), comment, exercises: [] },
          urlQuery: location.search,
        })
      ).unwrap();
      setSnackbar("Training session added", "success");
    } catch (error) {
      console.error("Failed to add new training session:", error);
    } finally {
      setAddRequestStatus("IDLE");
      handleCloseAddTrainingDialog();
    }
  };

  const onSubmit: SubmitHandler<FormDataType> = async (values) => {
    // protection against submitting form twice
    if (!requestInProgress.current) {
      requestInProgress.current = true;

      try {
        await createTrainingSession(values.date!, values.comment);
      } finally {
        requestInProgress.current = false;
        handleCloseAddTrainingDialog();
      }
    }
  };

  return (
    <>
      <Fab
        size="medium"
        color="secondary"
        aria-label="add training session"
        sx={{ marginLeft: "auto" }}
        onClick={handleOpenAddTrainingDialog}
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={addTrainingDialogOpen}
        onClose={handleCloseAddTrainingDialog}
        scroll="paper"
        aria-labelledby="add-training-session-dialog-title"
        sx={{ margin: "0rem" }}
      >
        <DialogTitle id="add-training-session-dialog-title">
          Add Training Session
          <IconButton
            aria-label="close"
            onClick={handleCloseAddTrainingDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            dividers={true}
            sx={{ opacity: actionStatus === "PROCESSING" ? 0.5 : 1 }}
          >
            <Stack spacing={0} direction="column" alignItems="center">
              <Controller
                render={({ field, fieldState, formState }) => (
                  <DatePickerField field={field} fieldState={fieldState} />
                )}
                name="date"
                control={control}
                rules={{
                  validate: {
                    ...commonDateValidation,
                  },
                }}
              />

              <Controller
                render={({ field, fieldState, formState }) => (
                  <TextField
                    id="comment"
                    margin="normal"
                    fullWidth
                    label="Comment"
                    multiline
                    variant="filled"
                    autoFocus
                    inputProps={{ maxLength: maxCommentSigns }}
                    {...MuiTextFieldPropsError(field, fieldState)}
                  />
                )}
                name="comment"
                control={control}
                rules={{
                  maxLength: {
                    value: maxCommentSigns,
                    message: `Max length is ${maxCommentSigns} characters`,
                  },
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={handleCloseAddTrainingDialog}>
              Cancel
            </Button>

            <Button
              type="submit"
              size="large"
              disabled={
                isSubmitting || !isValid || actionStatus === "PROCESSING"
              }
            >
              {actionStatus === "PROCESSING" && (
                <CircularProgress size={24} sx={{ mr: "0.5rem" }} />
              )}
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AddTrainingSession;
