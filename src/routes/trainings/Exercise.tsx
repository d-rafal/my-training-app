import { ExerciseDataFromApi } from "../../interfaces/trainingsInterf";
import SeriesRow from "./SeriesRow";
import {} from "../../components/mui/app-accordion/AppAccordion";
import TrainingAccordion from "./TrainingAccordion";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SpeedDial,
  SpeedDialAction,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { IdFromApi } from "../../interfaces/commonInterf";
import { useLocation, useSearchParams } from "react-router-dom";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { ExerciseDialogStateType } from "./Training";

import { useSetSnackbarContext } from "../../components/snackbar-provider/SnackbarProvider";

import { useMutation, useQueryClient } from "react-query";
import api from "../../api";
import useQueryUser from "../../react-query-hooks/useQueryUser";

const Exercise = ({
  exercise,
  training_id,
  exerciseIndex,
  exercises,
  setExerciseDialogState,
}: {
  exercise: ExerciseDataFromApi;
  training_id: IdFromApi;
  exerciseIndex: number;
  exercises: ExerciseDataFromApi[];
  setExerciseDialogState: React.Dispatch<
    React.SetStateAction<ExerciseDialogStateType>
  >;
}) => {
  const series = exercise.series.map((element) => element.quantity).join(", ");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const setSnackbar = useSetSnackbarContext();

  const queryClient = useQueryClient();
  const user = useQueryUser();
  const mutation = useMutation(
    () => {
      const exercises_shallowCopyForMutation = [...exercises];
      exercises_shallowCopyForMutation.splice(exerciseIndex, 1);
      return api.trainings
        .updateExercises(
          training_id,
          exercises_shallowCopyForMutation,
          location.search
        )
        .then(
          (res) => res,
          (error) => {
            throw error;
          }
        );
    },
    {
      onSuccess: (data, variables, context) => {
        if (user) {
          queryClient.setQueryData(
            ["trainings", { search: searchParams.toString() }],
            data
          );
        }
        setSnackbar("Exercise deleted", "info");
      },
      onError: (error, variables, context) => {
        console.error("Failed to add exercise:", error);
        setSnackbar("Failed to add exercise", "error", undefined, true);
      },
      onSettled: (data, error, variables, context) => {
        handleCloseDialog();
      },
    }
  );

  const accordionSummaryId = `exercise_${exercise._id}`;

  const deleteButtonOnClickHandle = (e: React.MouseEvent<HTMLDivElement>) => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOnDeleteExercise = () => {
    mutation.mutate();
  };

  return (
    <>
      <TrainingAccordion
        summaryId={accordionSummaryId}
        summaryText={`${exercise.name}: [${
          series.length ? series : "no series"
        }]`}
        summaryIcons={
          <Box
            sx={{ position: "relative", width: "5rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <SpeedDial
              ariaLabel="Edit options"
              direction="left"
              FabProps={{
                size: "small",
                color: "primary",
              }}
              sx={{
                position: "absolute",
                top: "0px",
                right: "0px",
                transform: "translateY(-50%)",
                "& .MuiButtonBase-root": {
                  width: "2rem",
                  height: "2rem",
                  minHeight: "unset",
                },
              }}
              icon={<MoreVertIcon />}
            >
              <SpeedDialAction
                icon={<DeleteIcon />}
                tooltipTitle="Delete exercise"
                onClick={deleteButtonOnClickHandle}
              />
              <SpeedDialAction
                icon={<AddIcon />}
                tooltipTitle="Add exercise"
                onClick={() => {
                  setExerciseDialogState({ open: true, index: exerciseIndex });
                }}
              />
              <SpeedDialAction
                icon={<EditIcon />}
                tooltipTitle="Edit exercise"
                onClick={() => {
                  setExerciseDialogState({
                    open: true,
                    index: exerciseIndex,
                    initialValues: exercise,
                  });
                }}
              />
            </SpeedDial>
          </Box>
        }
      >
        <TableContainer
          component="table"
          sx={{
            "& .MuiTableCell-root": {
              pl: "0.25rem",
              pr: "0.25rem",
              textAlign: "center",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography>Nr</Typography>
              </TableCell>
              <TableCell>
                <Typography>Load&nbsp;(kg)</Typography>
              </TableCell>
              <TableCell>
                <Typography>Quantity</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {exercise.series.map((series, index) => (
              <SeriesRow key={series._id} element={series} index={index} />
            ))}
          </TableBody>
        </TableContainer>
      </TrainingAccordion>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-exercise-dialog-title"
        aria-describedby="delete-exercise-dialog-description"
      >
        <DialogTitle id="delete-exercise-dialog-title">
          Delete exercise confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-exercise-dialog-description">
            Do you really want to delete exercise{" "}
            <strong>{exercise.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No</Button>
          <Button
            onClick={handleOnDeleteExercise}
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
    </>
  );
};

export default Exercise;
