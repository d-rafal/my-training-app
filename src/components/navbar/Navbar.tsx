import {
  useState,
  useCallback,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";

import { Link } from "react-router-dom";

import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  useScrollTrigger,
  styled,
  Stack,
  ListItemIcon,
  Divider,
  Theme,
} from "@mui/material";

import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

import MenuIcon from "@mui/icons-material/Menu";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

import AppSettings from "./app-settings/AppSettings";

import { drawerWidth } from "./SwipeableDrawer";
import {
  OpenDrawerContext,
  useDrawerSetOpen,
} from "../../contexts/LeftSideDrawerProvider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { TitleContext } from "../title-provider/TitleProvider";
import { useQueryClient } from "react-query";
import useQueryUser from "../../react-query-hooks/useQueryUser";

const profileLinks = [
  {
    text: "Profile",
    path: "/profile",
    icon: <PermIdentityIcon fontSize="medium" />,
  },
  {
    text: "My account",
    path: "/my-account",
    icon: <AssignmentIndIcon fontSize="medium" />,
  },
  { text: "Settings", path: "/settings", icon: <Settings fontSize="medium" /> },
];

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBarStyled = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Navbar() {
  const { data: user } = useQueryUser();

  const queryClient = useQueryClient();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const setDrawerOpen = useDrawerSetOpen();
  const drawerOpen = useContext(OpenDrawerContext);

  const title = useContext(TitleContext);

  const refToAppBar = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      "--header-height",
      refToAppBar.current?.getBoundingClientRect().height + "px"
    );
  }, []);

  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window,
  });

  const onLogout = useCallback(async () => {
    localStorage.removeItem("user");
    queryClient.setQueryData("user", undefined);
    queryClient.removeQueries("trainings");
  }, [queryClient]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBarStyled
      ref={refToAppBar}
      id="top-app-bar"
      position="fixed"
      color="primary"
      elevation={scrollTrigger ? 4 : 0}
      open={drawerOpen}
    >
      <Toolbar
        disableGutters
        sx={{
          pr: 2.5,
        }}
      >
        <IconButton
          size="large"
          aria-label="expand/collapse navigation menu"
          aria-controls="nav-drawer-menu"
          onClick={() => setDrawerOpen((open) => !open)}
          color="inherit"
          sx={{
            display: { xs: "flex;", md: "none" },
          }}
        >
          <MenuIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
        <IconButton
          size="large"
          aria-label="open navigation menu"
          aria-controls="nav-drawer-menu"
          aria-haspopup="true"
          onClick={() => setDrawerOpen((open) => !open)}
          color="inherit"
          sx={{
            display: { xs: "none;", md: "flex" },
          }}
        >
          {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>

        <Box>{title}</Box>

        <Stack direction="row" spacing={2} sx={{ ml: "auto" }}>
          <AppSettings
            sx={{
              display: { xs: "flex;", md: "none" },
            }}
          />

          <Tooltip title="Open user settings">
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{ p: 0 }}
              aria-label="account of current user"
              aria-controls="user-menu-appbar"
              aria-haspopup="true"
            >
              <Avatar alt="user1">
                <PermIdentityIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="user-menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                border: (theme: Theme) =>
                  theme.palette.mode === "dark"
                    ? `3px solid ${theme.palette.divider}`
                    : "unset",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                "& .MuiAvatar-root": {
                  mr: 2,
                },
                "&:before": {
                  content: '""',
                  display: (theme: Theme) =>
                    theme.palette.mode === "dark" ? "none" : "block",
                  position: "absolute",
                  top: 0,
                  right: 15,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  border: (theme: Theme) =>
                    theme.palette.mode === "dark"
                      ? `3px solid ${theme.palette.divider}`
                      : "unset",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            {user ? (
              <Box>
                {profileLinks.map((link) => (
                  <MenuItem
                    key={link.text}
                    component={Link}
                    to={link.path}
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    {link.text}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem
                  component={Link}
                  to="/"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    handleCloseUserMenu();
                    onLogout();
                  }}
                >
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Box>
            ) : (
              <MenuItem
                component={Link}
                to="/login"
                onClick={handleCloseUserMenu}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                Login
              </MenuItem>
            )}
          </Menu>
        </Stack>
      </Toolbar>
    </AppBarStyled>
  );
}

export default Navbar;
