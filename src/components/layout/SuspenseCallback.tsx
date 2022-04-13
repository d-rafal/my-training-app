import { CircularProgress, Stack, Typography } from "@mui/material";

const SuspenseCallback = () => {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "100%",
      }}
    >
      <CircularProgress size={120} sx={{ marginBottom: "1rem" }} />
      <Typography>Loading...</Typography>
    </Stack>
  );
};

export default SuspenseCallback;
