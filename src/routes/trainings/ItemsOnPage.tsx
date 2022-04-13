import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import tryConvertToFiniteNumber from "../../auxiliary/tryConvertToFiniteNumber";
import updateUrlQuery from "../../auxiliary/updateUrlQuery";
import useValueDependsOnUrl from "../../components/hooks/useValueDependsOnUrl";
import {
  DEFAULT_TRAININGS_ITEMS_PER_PAGE,
  isItemsPerPageType,
  TrainingsUrlQuery_Key_ItemsPerPage_Type,
  TRAININGS_URL_QUERY_KEYS,
  queryValueChecking,
  SIX_ITEMS_PER_PAGE,
  NINE_ITEMS_PER_PAGE,
} from "./trainingsConsts";

const itemsPerPageChecking = (value: any) => {
  return queryValueChecking(
    value,
    DEFAULT_TRAININGS_ITEMS_PER_PAGE,
    isItemsPerPageType
  );
};

export const updateUrl = (
  searchParams: URLSearchParams,
  setSearchParamsFn: ReturnType<typeof useSearchParams>[1],
  query: string,
  value: string
) => {
  let searchUrl = updateUrlQuery(searchParams.toString(), query, value);
  searchUrl = updateUrlQuery(searchUrl, TRAININGS_URL_QUERY_KEYS.page);
  setSearchParamsFn(searchUrl);
};

const ItemsOnPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // **** items per page form url ****
  const itemsPerPageUrl = itemsPerPageChecking(
    tryConvertToFiniteNumber(searchParams.get(TRAININGS_URL_QUERY_KEYS.items))
  );

  const [nrOfItemsOnPage, setNrOfItemsOnPage] =
    useValueDependsOnUrl<TrainingsUrlQuery_Key_ItemsPerPage_Type>(
      itemsPerPageUrl
    );

  const onItemsPerPageChanged = (e: SelectChangeEvent<number>) => {
    const nrOfItems = itemsPerPageChecking(Number(e.target.value));

    setNrOfItemsOnPage(nrOfItems);
    updateUrl(
      searchParams,
      setSearchParams,
      TRAININGS_URL_QUERY_KEYS.items,
      String(nrOfItems)
    );
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: "5rem" }}>
      <InputLabel id="nr-of-items-on-page-label">Show Items</InputLabel>
      <Select
        labelId="nr-of-items-on-page-label"
        id="nr-of-items-on-page"
        value={nrOfItemsOnPage}
        onChange={onItemsPerPageChanged}
        label="Show Items"
      >
        <MenuItem value={DEFAULT_TRAININGS_ITEMS_PER_PAGE}>
          {DEFAULT_TRAININGS_ITEMS_PER_PAGE}
        </MenuItem>
        <MenuItem value={SIX_ITEMS_PER_PAGE}>{SIX_ITEMS_PER_PAGE}</MenuItem>
        <MenuItem value={NINE_ITEMS_PER_PAGE}>{NINE_ITEMS_PER_PAGE}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ItemsOnPage;
