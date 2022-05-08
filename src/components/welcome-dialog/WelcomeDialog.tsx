import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const ListWithHyphen = styled("ul")({
  listStyleType: "none",
  "&>li": {
    "&:before": { content: "'- '" },
  },
});

const WelcomeDialog = () => {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);

  const handleCloseWelcomeDialog = () => {
    setShowWelcomeDialog(false);
  };
  return (
    <Dialog
      open={showWelcomeDialog}
      onClose={handleCloseWelcomeDialog}
      scroll="paper"
      aria-labelledby="welcome-dialog-title"
      sx={{ margin: "0rem" }}
    >
      <DialogTitle id="welcome-dialog-title">
        Welcome to my App
        <IconButton
          aria-label="close"
          onClick={handleCloseWelcomeDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true} sx={{ "& > p + p": { mt: "0.6rem" } }}>
        <Typography sx={{ mb: "0.5rem" }}>
          This <strong>SPA</strong> is a simple demonstration of usage some of
          react's environment libraries, such as:
        </Typography>
        <ListWithHyphen style={{ listStyle: "" }}>
          <li>react</li>
          <li>react-query (in previous commits was Redux Toolkit)</li>
          <li>react-hook-form (in previous commits was formik)</li>
          <li>material-ui</li>
        </ListWithHyphen>
        <Typography sx={{ mt: "1rem" }}>
          It's based on Create React App environment configuration, fully
          responsive and written in Typescript.
        </Typography>
        <Typography>
          A RESTful communication with a server is mocked within a browser by
          using "Mock Service Worker" library.
        </Typography>
        <Typography>
          The intention behind this app is to simplified documentation of a
          training progress, providing an interface to store subsequent training
          sessions data. As I said, it's only a demonstration, so all data you
          provide will be lost when you refresh a page or close a browser.
        </Typography>
        <Typography>
          I will put an effort to progressively add new functionalities to this
          app, especially if they would cover usage of new libraries.
        </Typography>
        <Typography>
          You can start playing with it by entering following user credentials:
        </Typography>
        <ListWithHyphen>
          <li>email: user1@user.com</li>
          <li>password: 123456</li>
        </ListWithHyphen>
        <Typography sx={{ mt: "1rem" }}>
          Use{" "}
          <Fab
            color="secondary"
            sx={{
              minHeight: "1.7rem",
              minWidth: "1.7rem",
              height: "1.7rem",
              width: "1.7rem",
            }}
          >
            <AddIcon sx={{ fontSize: "1.2rem" }} />
          </Fab>{" "}
          button to add a new training session, or just edit sample ones.
        </Typography>
        <Typography sx={{ mt: "1rem !important" }}>Enjoy!</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseWelcomeDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeDialog;
