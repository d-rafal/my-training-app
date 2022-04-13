export type TrainingsUrlQuery_Key_Search = "search";
export type TrainingsUrlQuery_Key_Page = "page";
export type TrainingsUrlQuery_Key_ItemsPerPage = "items";
export type TrainingsUrlQuery_Key_SortDateOrder = "sort-date-order";
export type TrainingsUrlQuery_Key_FilterByDate = "filter-by-date";

export type TrainingsUrlQueryKeys =
  | TrainingsUrlQuery_Key_Search
  | TrainingsUrlQuery_Key_Page
  | TrainingsUrlQuery_Key_ItemsPerPage
  | TrainingsUrlQuery_Key_SortDateOrder
  | TrainingsUrlQuery_Key_FilterByDate;

export type TrainingsUrlQuery_Key_Search_Type = string;

export type TrainingsUrlQuery_Key_Page_Type = number;

export const AVAILABLE_ITEMS_PER_PAGE = [5, 10, 15] as const;
export const THREE_ITEMS_PER_PAGE: typeof AVAILABLE_ITEMS_PER_PAGE[0] = 5;
export const SIX_ITEMS_PER_PAGE: typeof AVAILABLE_ITEMS_PER_PAGE[1] = 10;
export const NINE_ITEMS_PER_PAGE: typeof AVAILABLE_ITEMS_PER_PAGE[2] = 15;

export type TrainingsUrlQuery_Key_ItemsPerPage_Type =
  typeof AVAILABLE_ITEMS_PER_PAGE[number];

export const DEFAULT_TRAININGS_ITEMS_PER_PAGE: TrainingsUrlQuery_Key_ItemsPerPage_Type = 5;

export const isItemsPerPageType = (
  value: number
): value is TrainingsUrlQuery_Key_ItemsPerPage_Type =>
  AVAILABLE_ITEMS_PER_PAGE.find((element) => element === value) !== undefined;

export const AVAILABLE_SORT_DATE_ORDER = [
  "date-descending",
  "date-ascending",
] as const;

export type SortingDateDescending = "date-descending";
export type SortingDateAscending = "date-ascending";
export type TrainingsUrlQuery_Key_SortDateOrder_Type =
  typeof AVAILABLE_SORT_DATE_ORDER[number];

export const DEFAULT_SORT_DATE_ORDER: TrainingsUrlQuery_Key_SortDateOrder_Type =
  "date-descending";

export type TrainingsUrlQuery_Key_FilterByDate_Type = string;

export const isSortDateOrderType = (
  value: string
): value is TrainingsUrlQuery_Key_SortDateOrder_Type =>
  AVAILABLE_SORT_DATE_ORDER.find((element) => element === value) !== undefined;

export interface TrainingsUrlQueryKeys_Type {
  search: TrainingsUrlQuery_Key_Search;
  page: TrainingsUrlQuery_Key_Page;
  items: TrainingsUrlQuery_Key_ItemsPerPage;
  sortDateOrder: TrainingsUrlQuery_Key_SortDateOrder;
  filterByDate: TrainingsUrlQuery_Key_FilterByDate;
}
export const TRAININGS_URL_QUERY_KEYS: TrainingsUrlQueryKeys_Type = {
  search: "search",
  page: "page",
  items: "items",
  sortDateOrder: "sort-date-order",
  filterByDate: "filter-by-date",
};

export interface TrainingsUrlQueryKeysValues_Type {
  search?: string;
  page?: string;
  items?: string;
  sortDateOrder?: string;
}

export const TRAININGS_DEFAULT_URL_QUERY = `?${TRAININGS_URL_QUERY_KEYS.page}=1&${TRAININGS_URL_QUERY_KEYS.items}=${DEFAULT_TRAININGS_ITEMS_PER_PAGE}`;

export const queryValueChecking = <D>(
  queryValue: any,
  defaultValue: D,
  typeCheckingFn: (value: any) => value is D
): D => {
  if (
    queryValue !== null &&
    queryValue !== undefined &&
    typeCheckingFn(queryValue)
  ) {
    return queryValue;
  } else {
    return defaultValue;
  }
};

export const MAX_SEARCH_STRING = 20;
