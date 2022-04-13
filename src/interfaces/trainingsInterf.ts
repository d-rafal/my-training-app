import { IdFromApi } from "./commonInterf";
import { ActionStatus, OrNull } from "./generalInterf";

export interface SeriesData {
  readonly quantity: number;
  readonly load: number | "-";
}

export interface SeriesDataFromApi extends SeriesData {
  readonly _id: IdFromApi;
}

interface ExerciseDataBase {
  readonly name: string;
  readonly comment: string;
}

export interface ExerciseData extends ExerciseDataBase {
  readonly series: SeriesData[];
}

export interface ExerciseDataFromApi extends ExerciseDataBase {
  readonly series: SeriesDataFromApi[];
  readonly _id: IdFromApi;
}

export interface TrainingSessionDataBase {
  readonly date: string;
  readonly comment: string;
}
export interface TrainingSessionData extends TrainingSessionDataBase {
  readonly exercises: ExerciseData[];
}

export interface TrainingSessionDataFromApi extends TrainingSessionDataBase {
  readonly exercises: ExerciseDataFromApi[];
  readonly _id: IdFromApi;
}

export interface TrainingsBase {
  readonly currentPage: number;
  readonly numberOfPages: number;
}

export interface TrainingsFromApi extends TrainingsBase {
  readonly trainingSessions: TrainingSessionDataFromApi[];
}

export interface PartialInitialTrainingsState {
  readonly actionStatus: ActionStatus;
  readonly addTrainingSession_ActionStatus: ActionStatus;
  readonly updateExercises_ActionStatus: ActionStatus;
  readonly error: OrNull<string>;
  readonly currentRequestId: OrNull<string>;
  readonly currentPage: number;
  readonly numberOfPages: number;
}
