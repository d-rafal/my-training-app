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
import { useLocation, useSearchParams } from "react-router-dom";
import { ActionStatus, OrNull } from "../../interfaces/generalInterf";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { commonDateValidation, DatePickerField } from "./FilterByDate";
import { MuiTextFieldPropsError } from "../auth/AuthSide";

import { useSetSnackbarContext } from "../../components/snackbar-provider/SnackbarProvider";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

import { Query, useMutation, useQueryClient } from "react-query";
import api from "../../api";
import useQueryUser from "../../react-query-hooks/useQueryUser";
import { TrainingsQueryKey } from "../../react-query-hooks/useQueryTrainings";

const maxCommentSigns = 255;

interface FormDataType {
  date: OrNull<Date>;
  comment: "";
}

const AddTrainingSession = () => {
  const [, setAddRequestStatus] = useState<ActionStatus>("IDLE");

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

  const queryClient = useQueryClient();
  const user = useQueryUser();
  const [searchParams] = useSearchParams();

  const mutation = useMutation(
    ({ date, comment }: { date: Date; comment: string }) =>
      api.trainings
        .addTrainingSession(
          {
            date: date.toISOString(),
            comment,
            exercises: [],
          },
          location.search
        )
        .then(
          (res) => res,
          (error) => {
            throw error;
          }
        ),
    {
      onSuccess: (data, variables, context) => {
        if (user) {
          queryClient.setQueryData(
            ["trainings", { search: searchParams.toString() }],
            data
          );

          queryClient.resetQueries({
            predicate: (query) =>
              query.queryKey[0] === "trainings" &&
              (
                query as any as Query<
                  unknown,
                  unknown,
                  unknown,
                  TrainingsQueryKey
                >
              ).queryKey[1].search !== searchParams.toString(),
          });
        }
        setSnackbar("Training session added", "success");
      },
      onError: (error, variables, context) => {
        console.error("Failed to add new training session:", error);
        setSnackbar(
          "Failed to add new training session",
          "error",
          undefined,
          true
        );
      },
      onSettled: (data, error, variables, context) => {
        setAddRequestStatus("IDLE");
        handleCloseAddTrainingDialog();
      },
    }
  );

  const handleOpenAddTrainingDialog = () => {
    setAddTrainingDialogOpen(true);
  };

  const handleCloseAddTrainingDialog = () => {
    setAddTrainingDialogOpen(false);
  };

  const onSubmit: SubmitHandler<FormDataType> = async (values) => {
    // protection against submitting form twice
    if (!requestInProgress.current) {
      requestInProgress.current = true;

      try {
        await mutation.mutateAsync({
          date: values.date!,
          comment: values.comment,
        });
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
            sx={{ opacity: mutation.isLoading ? 0.5 : 1 }}
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
              disabled={isSubmitting || !isValid || mutation.isLoading}
            >
              {mutation.isLoading && (
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
