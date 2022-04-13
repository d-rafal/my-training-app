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
import { useAppDispatch } from "../../store/hooks/hooks";
import { updateExercises } from "../../store/features/trainings/trainingsActionCreators";
import { IdFromApi } from "../../interfaces/commonInterf";
import { useLocation } from "react-router-dom";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { ExerciseDialogStateType } from "./Training";
import { useSelectActionStatusAndError } from "../../store/features/trainings/trainingsSlice";
import { useSetSnackbarContext } from "../../components/snackbar-provider/SnackbarProvider";

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
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [actionStatus] = useSelectActionStatusAndError();

  const setSnackbar = useSetSnackbarContext();

  const accordionSummaryId = `exercise_${exercise._id}`;

  const deleteButtonOnClickHandle = (e: React.MouseEvent<HTMLDivElement>) => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOnDeleteExercise = async () => {
    try {
      const exercises_shallowCopyForMutation = [...exercises];
      exercises_shallowCopyForMutation.splice(exerciseIndex, 1);

      await dispatch(
        updateExercises({
          _id: training_id,
          exercises: exercises_shallowCopyForMutation,
          urlQuery: location.search,
        })
      ).unwrap();
      setSnackbar("Exercise deleted", "info");
    } catch (error) {
      console.error("Failed to add exercise:", error);
    } finally {
      handleCloseDialog();
    }
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
            disabled={actionStatus !== "IDLE"}
          >
            {actionStatus === "PROCESSING" && (
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
