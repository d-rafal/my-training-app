import { useEffect, useRef, useState } from "react";
// material
import { alpha } from "@mui/material/styles";
import {
  Box,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Theme,
  SxProps,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import enFlag from "../../../img/ic_flag_en.svg";
import deFlag from "../../../img/ic_flag_de.svg";
import MenuPopover from "../../menu-popover/MenuPopover";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { Localization, plPL, enUS } from "@mui/material/locale";
import {
  useChangeLocalizationContext,
  useInversePaletteModeContext,
} from "../../theme/AppThemeProvider";

const LANGS = [
  {
    value: enUS,
    label: "English",
    icon: enFlag,
  },
  {
    value: plPL,
    label: "Polski",
    icon: deFlag,
  },
];

const AppSettings = ({ sx = [] }: { sx?: SxProps<Theme> }) => {
  const inversePaletteMode = useInversePaletteModeContext();
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { locale, setLocale } = useChangeLocalizationContext();

  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"), {
    noSsr: true,
  });

  useEffect(() => {
    setOpen(false);
  }, [matchUpMd]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLocalizationChange = (local: Localization, index: number) => {
    setLocale(local);
    handleClose();
  };

  let chosenLocalizationIndex = LANGS.findIndex(
    (element) => element.value === locale
  );
  if (chosenLocalizationIndex < 0) chosenLocalizationIndex = 0;

  return (
    <Box sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <Tooltip title="Change Language">
        <IconButton
          ref={anchorRef}
          onClick={handleOpen}
          sx={{
            display: "none",
            padding: 0,
            width: 44,
            height: 44,
            ...(open && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.focusOpacity
                ),
            }),
          }}
        >
          <img
            src={LANGS[chosenLocalizationIndex].icon}
            alt={LANGS[chosenLocalizationIndex].label}
          />
        </IconButton>
      </Tooltip>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
      >
        <Box sx={{ py: 1 }}>
          {LANGS.map((option, index) => (
            <MenuItem
              key={option.label}
              selected={option.value === locale}
              onClick={() => handleLocalizationChange(option.value, index)}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box component="img" alt={option.label} src={option.icon} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: "body2" }}>
                {option.label}
              </ListItemText>
            </MenuItem>
          ))}
        </Box>
      </MenuPopover>

      <Tooltip title="Toggle theme">
        <IconButton sx={{ ml: 0 }} onClick={inversePaletteMode} color="inherit">
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default AppSettings;
