import { Box, Theme, Zoom } from "@mui/material";
import * as React from "react";
import useScrollTriggerApp from "../../hooks/useScrollTriggerApp";

const ScrollTop = ({
  children,
  threshold,
  bottom,
  right,
  scrollTarget,
}: {
  children: React.ReactNode;
  threshold: number;
  bottom: number;
  right: number;
  scrollTarget: React.RefObject<HTMLDivElement | Window>;
}) => {
  const [scrolledTrigger] = useScrollTriggerApp(threshold, scrollTarget);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    scrollTarget.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Zoom in={scrolledTrigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: "fixed",
          bottom,
          right,
          zIndex: (theme: Theme) => theme.zIndex.speedDial + 1,
        }}
      >
        {children}
      </Box>
    </Zoom>
  );
};

export default ScrollTop;
