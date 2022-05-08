import { Pagination, PaginationItem } from "@mui/material";

import { Link, useSearchParams } from "react-router-dom";
import tryConvertToFiniteNumber from "../../auxiliary/tryConvertToFiniteNumber";
import updateUrlQuery from "../../auxiliary/updateUrlQuery";

import { TRAININGS_URL_QUERY_KEYS } from "./trainingsConsts";

import useQueryTrainings from "../../react-query-hooks/useQueryTrainings";

const Paginate = () => {
  const [searchParams] = useSearchParams();

  const { data: numberOfPages } = useQueryTrainings(searchParams.toString(), {
    select: (data) => data.body.numberOfPages,
    keepPreviousData: true,
    enabled: false,
    notifyOnChangeProps: ["data"],
  });

  let currentPage = tryConvertToFiniteNumber(
    searchParams.get(TRAININGS_URL_QUERY_KEYS.page)
  );

  if (currentPage === null || currentPage <= 0) currentPage = 1;

  return (
    <Pagination
      size="small"
      page={currentPage}
      count={numberOfPages ? numberOfPages : 1}
      color="primary"
      siblingCount={1}
      renderItem={(params) => {
        const query = updateUrlQuery(
          searchParams.toString(),
          TRAININGS_URL_QUERY_KEYS.page,
          String(params.page)
        );

        return <PaginationItem {...params} component={Link} to={query} />;
      }}
    />
  );
};

export default Paginate;
