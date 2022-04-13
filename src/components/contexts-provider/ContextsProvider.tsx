import { StyledEngineProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/lab";
import AppThemeProvider from "../theme/AppThemeProvider";
import plLocale from "date-fns/locale/pl";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TitleProvider from "../title-provider/TitleProvider";
import SnackbarProvider from "../snackbar-provider/SnackbarProvider";
import LeftSideDrawerProvider from "../../contexts/LeftSideDrawerProvider";

const ContextsProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <StyledEngineProvider injectFirst>
      <AppThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={plLocale}>
          <TitleProvider>
            <SnackbarProvider>
              <LeftSideDrawerProvider>{children}</LeftSideDrawerProvider>
            </SnackbarProvider>
          </TitleProvider>
        </LocalizationProvider>
      </AppThemeProvider>
    </StyledEngineProvider>
  );
};

export default ContextsProvider;
