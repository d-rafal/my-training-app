import { Stack, Typography } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

const UnderConstruction = () => {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ width: "100%", height: "100%" }}
    >
      <AutoFixHighIcon sx={{ fontSize: "10rem", mb: "3rem" }} />
      <Typography variant="h2" component="h1" align="center">
        Under Construction
      </Typography>
    </Stack>
  );
};

export default UnderConstruction;
