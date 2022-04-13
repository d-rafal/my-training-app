import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks/hooks";
import {
  useSelectActionStatusAndError,
  useSelectTrainingIds,
} from "../../store/features/trainings/trainingsSlice";
import Training from "./Training";
import { fetchTrainings } from "../../store/features/trainings/trainingsActionCreators";
import { Alert, Box, Grid, Typography } from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";

function TrainingList() {
  const [actionStatus] = useSelectActionStatusAndError();
  const trainingsIds = useSelectTrainingIds();

  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const [firstFetchDone, setFirstFetchDone] = useState(false);

  const searchParamsAsString = searchParams.toString();
  useEffect(() => {
    let promise: any = null;

    const fetch = async () => {
      try {
        promise = dispatch(
          fetchTrainings({ searchParams: searchParamsAsString })
        );
        await promise;
      } finally {
        if (!firstFetchDone) setFirstFetchDone(true);
      }
    };

    fetch();

    return () => {
      if (typeof promise?.abort === "function") {
        promise.abort();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsAsString, dispatch]);

  let renderedElements = null;

  if (actionStatus === "FAILED" && firstFetchDone) {
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
  } else {
    let trainingList = null;

    if (firstFetchDone) {
      if (trainingsIds.length) {
        trainingList = (
          <Box
            sx={{
              opacity: actionStatus === "PROCESSING" ? 0.5 : 1,
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
              {trainingsIds?.map((_id) => (
                <Training key={_id} _id={_id} />
              ))}
            </Grid>
          </Box>
        );
      } else if (actionStatus === "IDLE") {
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
    }

    renderedElements = (
      <Box
        sx={{
          position: "relative",
        }}
      >
        {trainingList}
        {actionStatus === "PROCESSING" && !trainingsIds.length ? (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
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
        ) : null}
      </Box>
    );
  }

  return <Box mt="1.5rem">{renderedElements}</Box>;
}

export default TrainingList;
