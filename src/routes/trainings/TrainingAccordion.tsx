import { Stack, Typography } from "@mui/material";
import {
  AppAccordion,
  AppAccordionDetails,
  AppAccordionSummary,
} from "../../components/mui/app-accordion/AppAccordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

const TrainingAccordion = ({
  summaryId,
  summaryText,
  summaryIcons,
  children,
}: {
  summaryId: string;
  summaryText: string;
  summaryIcons: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <AppAccordion
      TransitionProps={{ unmountOnExit: true }}
      expanded={expanded}
      onChange={() => setExpanded((expanded) => !expanded)}
      sx={{
        maxWidth: "100%",
        "& .MuiAccordionSummary-content": { maxWidth: "calc(100% - 24px)" },
      }}
    >
      <AppAccordionSummary
        aria-controls={summaryId}
        id={summaryId}
        expandIcon={<ExpandMoreIcon />}
        sx={{}}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            maxWidth: "100%",
          }}
          flexGrow={1}
        >
          <Typography
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {summaryText}
          </Typography>

          {summaryIcons}
        </Stack>
      </AppAccordionSummary>
      <AppAccordionDetails>{children}</AppAccordionDetails>
    </AppAccordion>
  );
};

export default TrainingAccordion;
