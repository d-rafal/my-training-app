import { createAsyncThunk, EntityId } from "@reduxjs/toolkit";
import { URLSearchParamsInit } from "react-router-dom";
import {
  ExerciseData,
  TrainingSessionData,
  TrainingsFromApi,
} from "../../../interfaces/trainingsInterf";
import { ExtraArgument, RootState } from "../../store";
import { TRAININGS_URL_QUERY_KEYS } from "../../../routes/trainings/trainingsConsts";
import updateUrlQuery from "../../../auxiliary/updateUrlQuery";
import { IdFromApi } from "../../../interfaces/commonInterf";

/**
 * description
 *
 * @param searchParams
 * @returns returnDescription
 */
export const fetchTrainings = createAsyncThunk<
  TrainingsFromApi | null,
  {
    searchParams: string | URLSearchParams;
  },
  {
    state: RootState;
    rejectValue: undefined;
    extra: ExtraArgument;
    pendingMeta: { fetchTrainings: boolean; operationType: "fetchTrainings" };
    rejectedMeta: {
      errorTextForUser: "Error during loading trainings!";
      operationType: "fetchTrainings";
    };
    fulfilledMeta: {
      operationType: "fetchTrainings";
      userAlreadyLogout?: boolean;
    };
  }
>(
  "trainings/fetch",
  async ({ searchParams }, thunkAPI) => {
    const errorTextForUser = "Error during loading trainings!";

    try {
      const res = await thunkAPI.extra.api.trainings.getTrainings(
        searchParams,

        thunkAPI.signal
      );

      if (res.ok) {
        if (thunkAPI.getState().auth.user) {
          return thunkAPI.fulfillWithValue(res.body, {
            operationType: "fetchTrainings",
          });
        } else {
          return thunkAPI.fulfillWithValue(null, {
            operationType: "fetchTrainings",
            userAlreadyLogout: true,
          });
        }
      } else {
        console.error(`${res.status} ${res.statusText}`);
        return thunkAPI.rejectWithValue(undefined, {
          errorTextForUser,
          operationType: "fetchTrainings",
        });
      }
    } catch (error) {
      console.error();
      throw new Error(errorTextForUser);
    }
  },
  {
    getPendingMeta: () => ({
      fetchTrainings: true,
      operationType: "fetchTrainings",
    }),
  }
);

interface SetSearchParams {
  (
    nextInit: URLSearchParamsInit,
    navigateOptions?:
      | {
          replace?: boolean | undefined;
          state?: any;
        }
      | undefined
  ): void;
}

export const deleteTrainingSession = createAsyncThunk<
  TrainingsFromApi | null,
  {
    _id: EntityId;
    query: string;
    setSearchParams: SetSearchParams;
  },
  {
    state: RootState;
    rejectValue: undefined;
    extra: ExtraArgument;
    pendingMeta: {
      deleteTrainingSession: boolean;
      operationType: "deleteTrainingSession";
    };
    rejectedMeta: {
      errorTextForUser: "Error during deleting training!";
      operationType: "deleteTrainingSession";
    };
    fulfilledMeta: {
      operationType: "deleteTrainingSession";
      userAlreadyLogout?: boolean;
    };
  }
>(
  "trainings/deleteSession",
  async ({ _id, query, setSearchParams }, thunkAPI) => {
    const errorTextForUser = "Error during deleting training!";

    try {
      const res = await thunkAPI.extra.api.trainings.deleteTrainingSession(
        _id,
        query
      );

      if (res.ok) {
        if (thunkAPI.getState().auth.user) {
          if (
            thunkAPI.getState().trainings.currentRequestId ===
            thunkAPI.requestId
          ) {
            const pageUrl = new RegExp(
              `${TRAININGS_URL_QUERY_KEYS.page}=([^&]*)`
            ).exec(query)?.[1];

            if (pageUrl !== String(res.body.currentPage)) {
              const searchUrl = updateUrlQuery(
                query,
                TRAININGS_URL_QUERY_KEYS.page,
                String(res.body.currentPage)
              );
              setSearchParams(searchUrl);
            }
          }

          return thunkAPI.fulfillWithValue(res.body, {
            operationType: "deleteTrainingSession",
          });
        } else {
          return thunkAPI.fulfillWithValue(null, {
            operationType: "deleteTrainingSession",
            userAlreadyLogout: true,
          });
        }
      } else {
        console.error(`${res.status} ${res.statusText}`);
        return thunkAPI.rejectWithValue(undefined, {
          errorTextForUser,
          operationType: "deleteTrainingSession",
        });
      }
    } catch (error) {
      console.error();
      throw new Error(errorTextForUser);
    }
  },
  {
    getPendingMeta: () => ({
      deleteTrainingSession: true,
      operationType: "deleteTrainingSession",
    }),
  }
);

export const addTrainingSession = createAsyncThunk<
  TrainingsFromApi | null,
  {
    trainingSession: TrainingSessionData;
    urlQuery: string;
  },
  {
    state: RootState;
    rejectValue: undefined;
    extra: ExtraArgument;
    pendingMeta: {
      addTrainingSession: boolean;
      operationType: "addTrainingSession";
    };
    rejectedMeta: {
      errorTextForUser: "Error during adding training!";
      operationType: "addTrainingSession";
    };
    fulfilledMeta: {
      operationType: "addTrainingSession";
      userAlreadyLogout?: boolean;
    };
  }
>(
  "trainings/addedSession",
  async ({ trainingSession, urlQuery }, thunkAPI) => {
    const errorTextForUser = "Error during adding training!";

    try {
      const res = await thunkAPI.extra.api.trainings.addTrainingSession(
        trainingSession,
        urlQuery
      );

      if (res.ok) {
        if (thunkAPI.getState().auth.user) {
          return thunkAPI.fulfillWithValue(res.body, {
            operationType: "addTrainingSession",
          });
        } else {
          return thunkAPI.fulfillWithValue(null, {
            operationType: "addTrainingSession",
            userAlreadyLogout: true,
          });
        }
      } else {
        console.error(`${res.status} ${res.statusText}`);
        return thunkAPI.rejectWithValue(undefined, {
          errorTextForUser,
          operationType: "addTrainingSession",
        });
      }
    } catch (error) {
      console.error();
      throw new Error(errorTextForUser);
    }
  },
  {
    condition: (_, { getState }) => {
      // Prevent adding one instance of a training session twice
      if (getState().trainings.addTrainingSession_ActionStatus !== "IDLE") {
        return false;
      }
    },
    getPendingMeta: () => ({
      addTrainingSession: true,
      operationType: "addTrainingSession",
    }),
  }
);

export const updateExercises = createAsyncThunk<
  TrainingsFromApi | null,
  {
    _id: IdFromApi;
    exercises: ExerciseData[];
    urlQuery: string;
  },
  {
    state: RootState;
    rejectValue: undefined;
    extra: ExtraArgument;
    pendingMeta: { updateExercises: boolean; operationType: "updateExercises" };
    rejectedMeta: {
      errorTextForUser: "Error during updating exercise!";
      operationType: "updateExercises";
    };
    fulfilledMeta: {
      operationType: "updateExercises";
      userAlreadyLogout?: boolean;
    };
  }
>(
  "trainings/updateExercises",
  async ({ _id, exercises, urlQuery }, thunkAPI) => {
    const errorTextForUser = "Error during updating exercise!";

    try {
      const res = await thunkAPI.extra.api.trainings.updateExercises(
        _id,
        exercises,
        urlQuery
      );

      if (res.ok) {
        if (thunkAPI.getState().auth.user) {
          return thunkAPI.fulfillWithValue(res.body, {
            operationType: "updateExercises",
          });
        } else {
          return thunkAPI.fulfillWithValue(null, {
            operationType: "updateExercises",
            userAlreadyLogout: true,
          });
        }
      } else {
        console.error(`${res.status} ${res.statusText}`);
        return thunkAPI.rejectWithValue(undefined, {
          errorTextForUser,
          operationType: "updateExercises",
        });
      }
    } catch (error) {
      console.error();
      throw new Error(errorTextForUser);
    }
  },
  {
    condition: (_, { getState }) => {
      // Prevent add/update exercises twice
      if (getState().trainings.updateExercises_ActionStatus !== "IDLE") {
        return false;
      }
    },
    getPendingMeta: () => ({
      updateExercises: true,
      operationType: "updateExercises",
    }),
  }
);
