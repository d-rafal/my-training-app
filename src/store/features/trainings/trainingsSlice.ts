import { shallowEqual } from "react-redux";
import {
  TrainingSessionDataFromApi,
  PartialInitialTrainingsState,
} from "../../../interfaces/trainingsInterf";
import { useAppSelector } from "../../hooks/hooks";

import { RootState } from "../../store";

import {
  CaseReducer,
  createEntityAdapter,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  addTrainingSession,
  deleteTrainingSession,
  fetchTrainings,
  updateExercises,
} from "./trainingsActionCreators";

import { logoutRequestStarted } from "../auth/authSlice";

const trainingsAdapter = createEntityAdapter<TrainingSessionDataFromApi>({
  selectId: (trainingSession) => trainingSession._id,
});

const partialInitialTrainingsState = {
  actionStatus: "IDLE",
  addTrainingSession_ActionStatus: "IDLE",
  updateExercises_ActionStatus: "IDLE",
  error: null,
  currentRequestId: null,
  currentPage: 1,
  numberOfPages: 1,
} as PartialInitialTrainingsState;

export const { selectById: selectTrainingById, selectIds: selectTrainingIds } =
  trainingsAdapter.getSelectors<RootState>((state) => state.trainings);

export const useSelectTrainingIds = () =>
  useAppSelector((state: RootState) => selectTrainingIds(state), shallowEqual);

export const trainingsInitialState = trainingsAdapter.getInitialState(
  partialInitialTrainingsState
);

type RootState_Trainings = typeof trainingsInitialState;

export const selectNumberOfPages = (state: RootState) =>
  state.trainings.numberOfPages;

export const useSelectActionStatusAndError = () =>
  useAppSelector(
    (state: RootState) =>
      [state.trainings.actionStatus, state.trainings.error] as const,
    shallowEqual
  );

const clearTrainingsData: CaseReducer<
  RootState_Trainings,
  PayloadAction<any>
> = (state, action) => {
  state.currentPage = 1;
  state.numberOfPages = 1;
  trainingsAdapter.removeAll(state);
};

const trainingsSlice = createSlice({
  name: "trainings",
  initialState: trainingsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logoutRequestStarted, (state, action) => {
        clearTrainingsData(state, action);
      })
      .addMatcher(
        isPending(
          fetchTrainings,
          deleteTrainingSession,
          addTrainingSession,
          updateExercises
        ),
        (state, action) => {
          const { requestId, operationType } = action.meta;

          state.actionStatus = "PROCESSING";
          state.currentRequestId = requestId;
          state.error = null;

          switch (operationType) {
            case "fetchTrainings":
              trainingsAdapter.removeAll(state);
              break;
            case "deleteTrainingSession":
              break;
            case "addTrainingSession":
              state.addTrainingSession_ActionStatus = "PROCESSING";
              break;
            case "updateExercises":
              state.updateExercises_ActionStatus = "PROCESSING";
              break;
            default:
              break;
          }
        }
      )
      .addMatcher(
        isFulfilled(
          fetchTrainings,
          deleteTrainingSession,
          addTrainingSession,
          updateExercises
        ),
        (state, action) => {
          const { requestId, operationType, userAlreadyLogout } = action.meta;

          if (state.currentRequestId === requestId) {
            state.actionStatus = "IDLE";
            state.currentRequestId = null;
            state.error = null;

            if (!userAlreadyLogout && action.payload) {
              state.currentPage = action.payload.currentPage;
              state.numberOfPages = action.payload.numberOfPages;
              trainingsAdapter.setAll(state, action.payload.trainingSessions);
            }

            switch (operationType) {
              case "fetchTrainings":
                break;
              case "deleteTrainingSession":
                break;
              case "addTrainingSession":
                state.addTrainingSession_ActionStatus = "IDLE";
                break;
              case "updateExercises":
                state.updateExercises_ActionStatus = "IDLE";
                break;
              default:
                break;
            }
          }
        }
      )
      .addMatcher(
        isRejected(
          fetchTrainings,
          deleteTrainingSession,
          addTrainingSession,
          updateExercises
        ),
        (state, action) => {
          const { aborted, requestId, errorTextForUser, operationType } =
            action.meta;

          if (state.currentRequestId === requestId) {
            const actionStatusAfterOperation = aborted ? "IDLE" : "FAILED";
            state.actionStatus = actionStatusAfterOperation;
            switch (operationType) {
              case "fetchTrainings":
                break;
              case "deleteTrainingSession":
                break;
              case "addTrainingSession":
                state.addTrainingSession_ActionStatus =
                  actionStatusAfterOperation;
                break;
              case "updateExercises":
                state.updateExercises_ActionStatus = actionStatusAfterOperation;
                break;
              default:
                break;
            }

            state.currentRequestId = null;

            if (!aborted) {
              clearTrainingsData(state, action);

              state.error = errorTextForUser
                ? errorTextForUser
                : action.error.message
                ? action.error.message
                : "Operation failed!";
            }
          }
        }
      )
      // default case
      .addDefaultCase((state, action) => {});
  },
});

export default trainingsSlice.reducer;
