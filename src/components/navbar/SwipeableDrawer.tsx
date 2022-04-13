import {
  alpha,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { config } from "../config/config";
import NavbarLink from "./navbar-link/NavbarLink";
import {
  OpenDrawerContext,
  useDrawerSetOpen,
} from "../../contexts/LeftSideDrawerProvider";
import { useContext, useEffect } from "react";
import AppSettings from "./app-settings/AppSettings";
import { matchPath, useLocation } from "react-router-dom";

const iOS =
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

export const drawerWidth: number = 200;

const SwipeableTemporaryDrawer = () => {
  const { pathname } = useLocation();
  const drawerOpen = useContext(OpenDrawerContext);
  const setDrawerOpen = useDrawerSetOpen();

  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"), {
    noSsr: true,
  });

  const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"), {
    noSsr: true,
  });

  useEffect(() => {
    setDrawerOpen(false);
  }, [matchUpMd, setDrawerOpen]);

  useEffect(() => {
    if (matchUpLg) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  }, [matchUpLg, setDrawerOpen]);

  const toggleDrawer = (
    open: boolean,
    event?: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const closeDrawer = (event: React.MouseEvent | React.KeyboardEvent) => {
    if (!matchUpLg) toggleDrawer(false, event);
  };
  const openDrawer = (event: React.MouseEvent | React.KeyboardEvent) => {
    toggleDrawer(false, event);
  };

  return (
    <SwipeableDrawer
      id="nav-drawer-menu"
      variant={matchUpMd ? "permanent" : "temporary"}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      ModalProps={{
        keepMounted: true,
      }}
      anchor="left"
      open={matchUpMd ? true : drawerOpen}
      onClose={closeDrawer}
      onOpen={openDrawer}
      sx={(theme) => ({
        zIndex: matchUpMd ? theme.zIndex.drawer : theme.zIndex.drawer + 2,
        "& .MuiDrawer-paper": {
          position: "relative",
          justifyContent: "space-between",
          whiteSpace: "nowrap",
          width: drawerWidth,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: "border-box",
          ...(matchUpMd &&
            !drawerOpen && {
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              width: "3.6rem",
            }),
        },
      })}
    >
      <Box role="presentation" onClick={closeDrawer} onKeyDown={closeDrawer}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={closeDrawer}>
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {config.links.map((link) => (
            <ListItem
              button
              component={NavbarLink}
              to={link.link}
              end={true}
              key={link.text}
              sx={(theme) => ({
                position: "relative",
                textTransform: "capitalize",
                color: theme.palette.text.secondary,
                "&::before": {
                  top: 0,
                  right: 0,
                  width: 3,
                  bottom: 0,
                  content: "''",
                  display: "none",
                  position: "absolute",
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 4,
                  backgroundColor: theme.palette.primary.main,
                },
                ...(matchPath(
                  {
                    path: link.link,
                    end: false,
                  },
                  pathname
                ) && {
                  color: "primary.main",
                  fontWeight: "fontWeightMedium",
                  bgcolor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                  ),
                  "&:before": { display: "block" },
                }),
              })}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <link.icon />
              </ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
      <Box>
        <Divider />
        <AppSettings
          sx={{
            width: !matchUpMd ? "100%" : "unset",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pb: "1rem",
            pt: "1rem",
          }}
        />
      </Box>
    </SwipeableDrawer>
  );
};

export default SwipeableTemporaryDrawer;
