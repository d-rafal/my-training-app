import { Outlet } from "react-router-dom";
import ErrorBoundary from "../error-boundary/ErrorBoundary";
import NavbarOnError from "../navbar/NavbarOnError";
import MainOnError from "../../routes/main/MainOnError";
import { Suspense, useEffect, useRef } from "react";
import { Fab, Box, Paper } from "@mui/material";
import ScrollTop from "../mui/scrol-top/ScrollTop";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SwipeableDrawer from "../navbar/SwipeableDrawer";
import SuspenseCallback from "./SuspenseCallback";
import { readingAppBarHeight } from "../../auxiliary/heightAdjustment";

interface LayoutProps {
  navbar: Exclude<React.ReactNode, undefined>;
  footer: Exclude<React.ReactNode, undefined>;
}

const scrollTopChildren = (
  <Fab color="secondary" size="small" aria-label="scroll back to top">
    <KeyboardArrowUpIcon />
  </Fab>
);

function Layout({ navbar, footer }: Readonly<LayoutProps>) {
  const mainScrollTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    readingAppBarHeight();
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", maxWidth: "100%" }}>
        <ErrorBoundary
          renderOnError={(error) => <NavbarOnError error={error} />}
        >
          {navbar}
        </ErrorBoundary>

        <SwipeableDrawer />

        <Paper
          component="main"
          sx={{
            flexGrow: 1,
            maxWidth: "100%",
          }}
        >
          <ErrorBoundary
            renderOnError={(error) => <MainOnError error={error} />}
          >
            <Box
              id="main-container"
              component="article"
              sx={{
                overflowY: "scroll",
                mt: "var(--header-height)",
                maxWidth: "100%",
                padding: { xs: "1.3rem", lg: "2rem" },
              }}
              ref={mainScrollTarget}
            >
              <Suspense fallback={<SuspenseCallback />}>
                <Outlet />
              </Suspense>
            </Box>

            <ScrollTop
              threshold={500}
              bottom={50}
              right={30}
              scrollTarget={mainScrollTarget}
            >
              {scrollTopChildren}
            </ScrollTop>
          </ErrorBoundary>
        </Paper>
      </Box>
    </>
  );
}

export default Layout;
