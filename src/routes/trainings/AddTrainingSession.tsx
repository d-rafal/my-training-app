import {
  Button,
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
import { Field, FieldProps, Form, Formik, FormikErrors } from "formik";

import { commonDateValidation, DatePickerField } from "./FilterByDate";
import MuiButtonSubmitWithFormik from "../../components/mui/button-submit-with-formik/MuiButtonSubmitWithFormik";
import { MuiTextFieldPropsFromFormikField } from "../auth/AuthSide";
import { useSelectActionStatusAndError } from "../../store/features/trainings/trainingsSlice";
import { useSetSnackbarContext } from "../../components/snackbar-provider/SnackbarProvider";

const maxCommentSigns = 255;

interface FormikValuesType {
  date: OrNull<Date>;
  comment: "";
}

const validate = (values: FormikValuesType) => {
  const errors: FormikErrors<FormikValuesType> = {};

  commonDateValidation(values.date, "date", errors);

  if (values.comment.length > maxCommentSigns) {
    errors.comment = `Max ${maxCommentSigns} signs`;
  }

  return errors;
};

const AddTrainingSession = () => {
  const [actionStatus] = useSelectActionStatusAndError();

  const [, setAddRequestStatus] = useState<ActionStatus>("IDLE");

  const dispatch = useAppDispatch();
  const location = useLocation();
  const [addTrainingDialogOpen, setAddTrainingDialogOpen] = useState(false);
  const requestInProgress = useRef(false);

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
        <Formik<FormikValuesType>
          initialValues={{
            date: new Date(),
            comment: "",
          }}
          validate={validate}
          onSubmit={async (values, actions) => {
            // protection against submitting form twice
            if (!requestInProgress.current) {
              requestInProgress.current = true;

              try {
                await createTrainingSession(values.date!, values.comment);
              } finally {
                requestInProgress.current = false;
                handleCloseAddTrainingDialog();
                actions.setSubmitting(false);
              }
            }
          }}
        >
          <Form noValidate>
            <DialogContent
              dividers={true}
              sx={{ opacity: actionStatus === "PROCESSING" ? 0.5 : 1 }}
            >
              <Stack spacing={0} direction="column" alignItems="center">
                <Field
                  name="date"
                  component={DatePickerField}
                  label="Training date"
                ></Field>
                <Field name="comment">
                  {({ field, form, meta }: FieldProps) => (
                    <TextField
                      id="comment"
                      {...MuiTextFieldPropsFromFormikField(field, meta)}
                      margin="normal"
                      fullWidth
                      label="Comment"
                      multiline
                      variant="filled"
                      inputProps={{ maxLength: maxCommentSigns }}
                      autoFocus
                    />
                  )}
                </Field>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddTrainingDialog}>Cancel</Button>
              <MuiButtonSubmitWithFormik
                size="large"
                actionStatus={actionStatus}
              >
                Add
              </MuiButtonSubmitWithFormik>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
    </>
  );
};

export default AddTrainingSession;
