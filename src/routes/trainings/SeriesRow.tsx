import { TableCell, TableRow } from "@mui/material";
import { SeriesDataFromApi } from "../../interfaces/trainingsInterf";

const SeriesRow = ({
  element,
  index,
}: {
  element: SeriesDataFromApi;
  index: number;
}) => {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        {element.load && element.load !== "-" ? element.load : "-"}
      </TableCell>
      <TableCell>{element.quantity}</TableCell>
    </TableRow>
  );
};

export default SeriesRow;
