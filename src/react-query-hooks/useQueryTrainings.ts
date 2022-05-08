import { useQuery, UseQueryOptions } from "react-query";
import api from "../api";
import { FetchDataReturnValue } from "../api/requests";
import { useSetSnackbarContext } from "../components/snackbar-provider/SnackbarProvider";
import { TrainingsFromApi } from "../interfaces/trainingsInterf";

export type TrainingsQueryKey = readonly [
  string,
  {
    search: string;
  }
];

const useQueryTrainings = <T = FetchDataReturnValue<TrainingsFromApi>>(
  searchParams: string,
  overrideOptions?: UseQueryOptions<
    FetchDataReturnValue<TrainingsFromApi>,
    Error,
    T,
    TrainingsQueryKey
  >
) => {
  const setSnackbar = useSetSnackbarContext();

  return useQuery<
    FetchDataReturnValue<TrainingsFromApi>,
    Error,
    T,
    TrainingsQueryKey
  >(
    ["trainings", { search: searchParams }],
    ({ queryKey, signal }) => {
      return api.trainings.getTrainings(queryKey[1].search, signal).then(
        (res) => res,
        (error) => {
          throw error;
        }
      );
    },
    {
      refetchOnWindowFocus: false,
      useErrorBoundary: false,
      onError: (error) => {
        console.error("Failed to fetch trainings:", error);
        setSnackbar("Failed to fetch trainings", "error", undefined, true);
      },
      ...overrideOptions,
    }
  );
};

export default useQueryTrainings;
