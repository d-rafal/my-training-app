import { EntityId } from "@reduxjs/toolkit";
import { AnyObject, IdFromApi } from "../interfaces/commonInterf";
import { OrUndefined } from "../interfaces/generalInterf";
import {
  ExerciseData,
  TrainingSessionData,
  TrainingsFromApi,
} from "../interfaces/trainingsInterf";
import {
  TrainingsUrlQueryKeysValues_Type,
  TRAININGS_URL_QUERY_KEYS,
} from "../routes/trainings/trainingsConsts";
import {
  dataCheckerNullOrUndefined,
  fetchData,
  FetchDataOptions,
  FetchDataReturnValue,
} from "./requests";

type Body =
  | AnyObject & {
      query?: TrainingsUrlQueryKeysValues_Type;
    };

const createBodyWithUrlQuery = (KeyValuePair?: AnyObject, query?: string) => {
  const body: Body = { ...KeyValuePair };

  if (query) {
    body.query = {};

    Object.entries(TRAININGS_URL_QUERY_KEYS).forEach(([key, value]) => {
      const queryValue = new RegExp(`${value}=([^&]*)`).exec(query)?.[1];

      if (queryValue && body.query) {
        body.query[key as keyof TrainingsUrlQueryKeysValues_Type] = queryValue;
      }
    });

    if (!Object.keys(body.query).length) {
      delete body.query;
    }
  }

  return Object.keys(body) ? body : undefined;
};

const addTrainingSession_api = async (
  data: TrainingSessionData,
  query?: string
) => {
  let body: OrUndefined<Body> = createBodyWithUrlQuery({ data }, query);

  return fetchData(
    "/trainings",
    "POST",
    body ? JSON.stringify(body) : undefined,
    undefined,
    undefined,
    dataCheckerNullOrUndefined
  ) as Promise<FetchDataReturnValue<TrainingsFromApi>>;
};

const updateExercises_api = async (
  _id: IdFromApi,
  exercises: ExerciseData[],
  query?: string
) => {
  let body: OrUndefined<Body> = createBodyWithUrlQuery(
    { _id, exercises },
    query
  );

  return fetchData(
    "/trainings/update-exercises",
    "PATCH",
    body ? JSON.stringify(body) : undefined,
    undefined,
    undefined,
    dataCheckerNullOrUndefined
  ) as Promise<FetchDataReturnValue<TrainingsFromApi>>;
};

const deleteTrainingSession_api = async (_id: EntityId, query?: string) => {
  let bodyJSON: OrUndefined<BodyInit> = undefined;
  let options: OrUndefined<FetchDataOptions> = undefined;

  let body: OrUndefined<Body> = createBodyWithUrlQuery(undefined, query);

  if (body) {
    bodyJSON = JSON.stringify(body);
    options = {
      deleteWithResponse: true,
    };
  }

  return fetchData(
    `/trainings/${_id}`,
    "DELETE",
    bodyJSON,
    options,
    undefined,
    dataCheckerNullOrUndefined
  ) as Promise<FetchDataReturnValue<TrainingsFromApi>>;
};

/**
 * getTrainings_api
 *
 * @param query - can be with or without leading "?"-
 */

const getTrainings_api = async (
  query?: URLSearchParams | string,
  abortControllerSignal?: AbortSignal
) => {
  let url = "/trainings";

  if (query) {
    if (typeof query === "string") {
      if (!/^\??$/.test(query)) {
        if (/^[^?]/.test(query)) {
          url += "?" + query;
        } else {
          url += query;
        }
      }
    } else {
      const searchQueryString = query.toString();
      if (searchQueryString.length) url += "?" + searchQueryString;
    }
  }

  return fetchData(
    url,
    "GET",
    undefined,
    undefined,
    abortControllerSignal,
    dataCheckerNullOrUndefined
  ) as Promise<FetchDataReturnValue<TrainingsFromApi>>;
};

const trainingsApi = {
  addTrainingSession: addTrainingSession_api,
  getTrainings: getTrainings_api,
  deleteTrainingSession: deleteTrainingSession_api,
  updateExercises: updateExercises_api,
};

export default trainingsApi;
