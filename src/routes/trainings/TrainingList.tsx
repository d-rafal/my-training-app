import { useSearchParams } from "react-router-dom";
import Training from "./Training";
import { Alert, Box, Grid, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import useQueryTrainings from "../../react-query-hooks/useQueryTrainings";
import useQueryUser from "../../react-query-hooks/useQueryUser";

function TrainingList() {
  const { data: user } = useQueryUser();
  const [searchParams] = useSearchParams();

  const { status, data, isFetching } = useQueryTrainings(
    searchParams.toString(),
    {
      select: (data) =>
        data.body.trainingSessions.map((training) => training._id),
      enabled: !!user,
    }
  );

  let renderedElements = null;

  if (status === "idle") {
    renderedElements = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Alert variant="filled" severity="info">
          No data.
        </Alert>
      </Box>
    );
  } else if (status === "loading") {
    renderedElements = (
      <Box
        sx={{
          // position: "absolute",
          // top: 0,
          // left: 0,
          // right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "20rem",
          height: "100%",
        }}
      >
        <CircularProgress size={120} sx={{ marginBottom: "1rem" }} />
        <Typography>Loading...</Typography>
      </Box>
    );
  } else if (status === "error") {
    renderedElements = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Alert variant="filled" severity="error">
          Operation failed, no data.
        </Alert>
      </Box>
    );
  } else if (status === "success") {
    let trainingList = null;

    if (data?.length) {
      trainingList = (
        <Box
          sx={{
            opacity: isFetching ? 0.5 : 1,
            // opacity: isPreviousData ? 0.5 : 1,
          }}
        >
          <Grid
            component="ul"
            container
            direction="column"
            rowSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{
              listStyle: "none",
              "& >.MuiGrid-item": { maxWidth: "100%" },
            }}
          >
            {data?.map((_id) => (
              <Training key={_id} _id={_id} />
            ))}
          </Grid>
        </Box>
      );
    } else {
      trainingList = (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Alert variant="filled" severity="info">
            No data.
          </Alert>
        </Box>
      );
    }

    renderedElements = (
      <Box
        sx={{
          position: "relative",
        }}
      >
        {trainingList}
      </Box>
    );
  }

  return <Box mt="1.5rem">{renderedElements}</Box>;
}

export default TrainingList;
