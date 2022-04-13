import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import { useSearchParams } from "react-router-dom";
import useValueDependsOnUrl from "../../components/hooks/useValueDependsOnUrl";
import { updateUrl } from "./ItemsOnPage";
import {
  DEFAULT_SORT_DATE_ORDER,
  TrainingsUrlQuery_Key_SortDateOrder_Type,
  TRAININGS_URL_QUERY_KEYS,
  isSortDateOrderType,
  queryValueChecking,
} from "./trainingsConsts";

const sortDateOrderChecking = (value: any) => {
  return queryValueChecking(
    value,
    DEFAULT_SORT_DATE_ORDER,
    isSortDateOrderType
  );
};

const SortingOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // **** sort date order form url ****
  const sortDateOrderUrl = sortDateOrderChecking(
    searchParams.get(TRAININGS_URL_QUERY_KEYS.sortDateOrder)
  );

  const [sortDateOrder, setSortDateOrder] =
    useValueDependsOnUrl<TrainingsUrlQuery_Key_SortDateOrder_Type>(
      sortDateOrderUrl
    );

  const onSortOrderChanged = (e: SelectChangeEvent<string>) => {
    const sortOrderTemp = sortDateOrderChecking(e.target.value);

    setSortDateOrder(sortOrderTemp);
    updateUrl(
      searchParams,
      setSearchParams,
      TRAININGS_URL_QUERY_KEYS.sortDateOrder,
      sortOrderTemp
    );
  };

  return (
    <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
      <InputLabel id="trainings-sort-order">Sort</InputLabel>
      <Select
        labelId="trainings-sort-order"
        id="nr-of-items-on-page"
        value={sortDateOrder}
        onChange={onSortOrderChanged}
        label="Sort"
      >
        <MenuItem value="date-descending">Date descending</MenuItem>
        <MenuItem value="date-ascending">Date ascending</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortingOrder;
