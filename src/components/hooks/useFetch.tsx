import { Reducer, ReducerState, useEffect, useReducer } from "react";
import { ActionStatus } from "../../interfaces/generalInterf";

export type UseFetchStateType<T> = {
  readonly actionStatus: ActionStatus;
  readonly error: string;
  readonly dataFromApi: T;
};

type USE_FETCH_INIT = "FETCH_INIT";
type USE_FETCH_FAILURE = "FETCH_FAILURE";
type USE_FETCH_SUCCESS = "FETCH_SUCCESS";

export type UseFetchStateReducerActionProp<T> =
  | { type: USE_FETCH_INIT }
  | { type: USE_FETCH_FAILURE; payload: string }
  | { type: USE_FETCH_SUCCESS; payload: T };

/**
 * My fetch hook.
 *
 * @remarks
 * This method is part of the {}.
 *
 * @param initialState - initial state
 * @param reducer - reducer
 * @param fetchFunction - function used to fetch data
 * @param searchQuery - optional search query
 * @param useAbortController - defines AbortController use case
 * @returns state and dispatch function
 *
 * @beta
 */

// const useFetch = <
//   StateType extends UseFetchStateType<any>,
//   ActionType extends UseFetchStateReducerActionProp<any>
// >(
//   initialState: StateType,
//   reducer: Reducer<StateType, ActionType | UseFetchStateReducerActionProp<any>>,
//   fetchFunction: () => Promise<any>
// ) =>
const useFetch = <
  R extends Reducer<UseFetchStateType<any>, UseFetchStateReducerActionProp<any>>
>(
  /** Description of prop "initialState".
   * @default foobar
   * */
  initialState: ReducerState<R>,
  reducer:
    | R
    | Reducer<UseFetchStateType<any>, UseFetchStateReducerActionProp<any>>,
  fetchFunction: (
    searchQuery?: URLSearchParams,
    abortControllerSignal?: AbortSignal
  ) => Promise<any>,
  useAbortController = false, // jeżeli np. gdy chcesz cos usunąc to jak operacja poszła to moim zdaniem nie powinna byc juz w zaden sposób zatrzymywane
  // możesz dać jedynie feedback czy się powiodła czy też nie
  // ustawiać na true jedynie jak np zaczytuję jakies dane do komponenty i ten komponent może być odmontowany bo wtedy po co
  // wykonywać operację czytania
  // nie wiem czy wogóle warto się bawić w coś takiego jak abort sygnał dodtkowy kod i nie wiem czy warto
  searchQuery?: URLSearchParams
): // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// tutaj dla testowania pewnych rzeczy sprecyzowałem co ma
// być zwracane przez tą funkcję ale normalnie nie precyzuj
// co ma być zwracane (chyba że jest to konieczne) i pozól żeby
// typescript sam wywnioskował, jedynie opserówj czy jego wnioski
// są zgone z tym co zamierzałeś
readonly [
  state: ReducerState<R> | UseFetchStateType<any>,
  dispatch: React.Dispatch<
    // React.ReducerAction<R> tak tez jest dobrze
    R extends Reducer<UseFetchStateType<any>, infer A> ? A : never
  >
  // dispatchChecker: (
  //   dispatchFn: React.Dispatch<
  //     UseFetchStateReducerActionProp<any> | React.ReducerAction<R>
  //   > | null
  // ) => React.Dispatch<
  //   UseFetchStateReducerActionProp<any> | React.ReducerAction<R>
  // >;
  // dispatchChecker(dispatchFn: React.Dispatch<
  //   R extends Reducer<StateType<any>, infer A> ? A : never
  // > | null) : React.Dispatch<
  //   R extends Reducer<StateType<any>, infer A> ? A : never
  // > | null;
  // lub
  // dispatch: Dispatch<ReducerAction<R>>;
] => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // let componentStillMountedRef = true;
    // const abortController = useAbortController ? new AbortController() : null;
    // const fetchData = async () => {
    //   dispatch({ type: "FETCH_INIT" });
    //   try {
    //     const { data } = await fetchFunction(
    //       searchQuery,
    //       abortController?.signal
    //     );
    //     if (componentStillMountedRef) {
    //       console.log(data);
    //       dispatch({
    //         type: "FETCH_SUCCESS",
    //         payload: data,
    //       });
    //     }
    //   } catch (error) {
    //     // if (error.name === "AbortError") {
    //     //   return;
    //     // }
    //     if (componentStillMountedRef) {
    //       dispatch({
    //         type: "FETCH_FAILURE",
    //         payload: "Loading data failed!",
    //       });
    //     }
    //   }
    // };
    // fetchData();
    // return () => {
    //   componentStillMountedRef = false;
    //   abortController?.abort();
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [state, dispatch] as const;
};

export default useFetch;
