import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";

import Paginate from "./Paginate";
import FilterByDate from "./FilterByDate";
import TrainingList from "./TrainingList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import AddTrainingSession from "./AddTrainingSession";
import {
  AppAccordion,
  AppAccordionDetails,
  AppAccordionSummary,
} from "../../components/mui/app-accordion/AppAccordion";
import useUpdateTitle from "../../components/title-provider/useUpdateTitle";
import ItemsOnPage from "./ItemsOnPage";
import SortingOrder from "./SortingOrder";

const Trainings = () => {
  const theme = useTheme();
  const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"), {
    noSsr: true,
  });

  useUpdateTitle("Trainings");

  return (
    <>
      <Box component="section">
        <AppAccordion sx={{ mb: 3 }}>
          <AppAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="filter-content"
            id="filter-header"
          >
            <Typography>Filters</Typography>
          </AppAccordionSummary>
          <AppAccordionDetails
            sx={{ mb: { xs: "1.3rem", lg: "0.5rem" }, pt: "1.5rem" }}
          >
            <Stack
              direction={matchUpLg ? "row" : "column"}
              alignItems={matchUpLg ? "start" : "center"}
              justifyContent={matchUpLg ? "space-between" : "center"}
              spacing={5}
              sx={{ flexWrap: "wrap" }}
            >
              <FilterByDate />

              <Stack direction="row" alignItems="center" spacing={2} sx={{}}>
                <ItemsOnPage />
                <SortingOrder />
              </Stack>
            </Stack>
          </AppAccordionDetails>
        </AppAccordion>

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mt: "1rem",
          }}
        >
          <Paginate />
          <AddTrainingSession />
        </Stack>
      </Box>
      <Box component="section" sx={{ maxWidth: "100%", mt: "1rem" }}>
        <Typography variant="h5" component="h1">
          Trainings:
        </Typography>
        <TrainingList />
      </Box>
    </>
  );
};

export default Trainings;
