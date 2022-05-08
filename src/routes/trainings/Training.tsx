import * as React from "react";
import Exercise from "./Exercise";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import DeleteIconButton from "../../components/mui/icon-buttons/DeleteIconButton";
import TrainingAccordion from "./TrainingAccordion";
import {
  TRAININGS_DEFAULT_URL_QUERY,
  TRAININGS_URL_QUERY_KEYS,
} from "./trainingsConsts";
import { useLocation, useSearchParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/system";
import AddOrEditTrainingExerciseDialog from "./AddOrEditTrainingExerciseDialog";

import { ExerciseDataFromApi } from "../../interfaces/trainingsInterf";
import { useSetSnackbarContext } from "../../components/snackbar-provider/SnackbarProvider";

import { useQueryClient, useMutation, Query } from "react-query";
import api from "../../api";

import useQueryTrainings, {
  TrainingsQueryKey,
} from "../../react-query-hooks/useQueryTrainings";
import useQueryUser from "../../react-query-hooks/useQueryUser";
import updateUrlQuery from "../../auxiliary/updateUrlQuery";
import { IdFromApi } from "../../interfaces/commonInterf";

export interface ExerciseDialogStateType {
  open: boolean;
  index?: number;
  initialValues?: ExerciseDataFromApi;
}

const trainingSessionDateInLocal = (dateISOString: string) => {
  const date = new Date(dateISOString);

  const year = String(date.getFullYear());
  let month = String(date.getMonth() + 1);
  let day = String(date.getDate());
  let hour = String(date.getHours());
  let minute = String(date.getMinutes());

  const addLeadingZero = (element: string) => {
    if (element.length < 2) {
      return "0" + element;
    } else {
      return element;
    }
  };

  month = addLeadingZero(month);
  day = addLeadingZero(day);
  hour = addLeadingZero(hour);
  minute = addLeadingZero(minute);

  return `${day}-${month}-${year} ${hour}:${minute}`;
};

const Training = ({ _id }: { _id: IdFromApi }) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const user = useQueryUser();

  const { data: trainingSession } = useQueryTrainings(searchParams.toString(), {
    select: (data) =>
      data.body.trainingSessions.find((training) => training._id === _id),
    enabled: false,
    notifyOnChangeProps: ["data"],
  });

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [exerciseDialogState, setExerciseDialogState] =
    React.useState<ExerciseDialogStateType>({
      open: false,
    });

  const setSnackbar = useSetSnackbarContext();

  const locationSearchForMutation = location.search
    ? location.search
    : TRAININGS_DEFAULT_URL_QUERY;

  const mutation = useMutation(
    () =>
      api.trainings.deleteTrainingSession(_id, locationSearchForMutation).then(
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

          const pageUrl = new RegExp(
            `${TRAININGS_URL_QUERY_KEYS.page}=([^&]*)`
          ).exec(locationSearchForMutation)?.[1];

          if (pageUrl !== String(data.body.currentPage)) {
            const searchUrl = updateUrlQuery(
              locationSearchForMutation,
              TRAININGS_URL_QUERY_KEYS.page,
              String(data.body.currentPage)
            );
            setSearchParams(searchUrl);
          }
        }

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
        setSnackbar("Training session deleted", "info");
      },
      onError: (error, variables, context) => {
        console.error("Failed to delete training session:", error);
        setSnackbar(
          "Failed to delete training session",
          "error",
          undefined,
          true
        );
      },
      onSettled: (data, error, variables, context) => {
        handleCloseDialog();
      },
    }
  );

  const accordionSummaryId = `session_${_id}`;

  let accordionSummaryText = "";

  if (trainingSession) {
    accordionSummaryText = trainingSessionDateInLocal(trainingSession.date);
  }

  const deleteButtonOnClickHandle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOnDeleteTrainingSession = () => {
    mutation.mutate();
  };

  return (
    <Grid component="li" item sx={{ maxWidth: "100%" }}>
      <TrainingAccordion
        summaryId={accordionSummaryId}
        summaryText={accordionSummaryText}
        summaryIcons={<DeleteIconButton onClick={deleteButtonOnClickHandle} />}
      >
        {trainingSession?.exercises.map((exercise, index) => (
          <Exercise
            key={exercise._id}
            exercise={exercise}
            training_id={trainingSession._id}
            exerciseIndex={index}
            exercises={trainingSession.exercises}
            setExerciseDialogState={setExerciseDialogState}
          />
        ))}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: "1.5rem",
            mb: "0.5rem",
            "&:first-of-type": { m: "1rem 0" },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() =>
              setExerciseDialogState({
                open: true,
              })
            }
          >
            Add Exercise
          </Button>
        </Box>
      </TrainingAccordion>

      {exerciseDialogState.open && (
        <AddOrEditTrainingExerciseDialog
          exerciseDialogState={exerciseDialogState}
          setExerciseDialogState={setExerciseDialogState}
          trainingSession={trainingSession}
        />
      )}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-training-session-dialog-title"
        aria-describedby="delete-training-session-dialog-description"
      >
        <DialogTitle id="delete-training-session-dialog-title">
          Delete training confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-training-session-dialog-description">
            Do you really want to delete training from{" "}
            <strong>
              {trainingSession
                ? trainingSessionDateInLocal(trainingSession.date)
                : ""}
            </strong>
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No</Button>
          <Button
            onClick={handleOnDeleteTrainingSession}
            autoFocus
            disabled={mutation.isLoading}
          >
            {mutation.isLoading && (
              <CircularProgress size={24} sx={{ mr: "0.5rem" }} />
            )}
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default React.memo(Training);
