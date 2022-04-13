import { DatePicker, DatePickerProps } from "@mui/lab";
import {
  Box,
  IconButton,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikErrors,
  useFormikContext,
} from "formik";

import { useSearchParams } from "react-router-dom";
import updateUrlQuery from "../../auxiliary/updateUrlQuery";
import MuiButtonSubmitWithFormik from "../../components/mui/button-submit-with-formik/MuiButtonSubmitWithFormik";
import { dateToString } from "../../auxiliary/date/dateToString";
import { TRAININGS_URL_QUERY_KEYS } from "./trainingsConsts";
import { stringToDate } from "../../auxiliary/date/stringToDate";
import { OrNull } from "../../interfaces/generalInterf";
import { isDateValid } from "../../auxiliary/date/isDateValid";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useEffect } from "react";

interface FormikValuesType {
  "start-date": OrNull<Date>;
  "end-date": OrNull<Date>;
}

const minAllowedDate = new Date(Date.UTC(2000, 1, 1, 0, 0, 0));

const ClearFilterByDate = ({
  removeFilterByDateFromUrl,
}: {
  removeFilterByDateFromUrl: () => void;
}) => {
  const { resetForm } = useFormikContext();

  return (
    <IconButton
      aria-label="clear filter"
      onClick={() => {
        resetForm();
        removeFilterByDateFromUrl();
      }}
    >
      <HighlightOffIcon sx={{ fontSize: "3rem" }} />
    </IconButton>
  );
};

const InitializeDatesFromUrl = ({
  dateFilter,
}: {
  dateFilter: string | null;
}) => {
  const { setFieldValue, values } = useFormikContext<FormikValuesType>();

  useEffect(() => {
    const updateDateInFormikValues = (
      urlDate: string,
      propName: keyof typeof values
    ) => {
      const date = stringToDate(urlDate);
      if (isDateValid(date)) {
        setFieldValue(propName, date);
      }
    };

    if (dateFilter) {
      const dates = dateFilter.match(
        /from-(\d{4}-\d{2}-\d{2})-to-(\d{4}-\d{2}-\d{2})/
      );

      if (dates?.[1]) {
        updateDateInFormikValues(dates[1], "start-date");
      }
      if (dates?.[2]) {
        updateDateInFormikValues(dates[2], "end-date");
      }
    } else {
      setFieldValue("start-date", null);
      setFieldValue("end-date", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  return null;
};

export const commonDateValidation = (
  date: Date | null,
  fieldName: string,
  errors: FormikErrors<any>
) => {
  if (!date || !isDateValid(date)) {
    errors[fieldName] = "Enter valid date";
  } else if (date > new Date()) {
    errors[fieldName] = "Future date not allowed";
  } else if (date < minAllowedDate) {
    errors[fieldName] = `Date before ${
      minAllowedDate.toLocaleString("pl-PL", { timeZone: "UTC" }).split(",")[0]
    }`;
  }
};

interface DatePickerFieldProps extends FieldProps, DatePickerProps {
  getShouldDisableDateError: (date: Date) => string;
}

export function DatePickerField({
  form,
  field,
  ...other
}: Omit<DatePickerFieldProps, "value" | "onChange" | "renderInput">) {
  const currentError = form.errors[field.name];
  const showError = form.touched[field.name] && !!currentError;

  return (
    <DatePicker
      mask={"__.__.____"}
      disableFuture
      allowSameDateSelection
      openTo="month"
      views={["year", "month", "day"]}
      minDate={minAllowedDate}
      value={field.value}
      onChange={(date) => {
        form.setFieldValue(field.name, date, true);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          name={field.name}
          error={showError}
          helperText={
            (showError && currentError ? currentError : " ") as string
          }
          onBlur={form.handleBlur}
        />
      )}
      {...other}
    />
  );
}

const validateDates = (values: FormikValuesType) => {
  const errors: FormikErrors<FormikValuesType> = {};

  const startDate = values["start-date"];
  const endDate = values["end-date"];

  commonDateValidation(startDate, "start-date", errors);

  commonDateValidation(endDate, "end-date", errors);
  if (endDate !== null && startDate !== null && endDate <= startDate) {
    errors["end-date"] = "End date after start date";
  }

  return errors;
};

const FilterByDate = () => {
  const theme = useTheme();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const dateFilter = searchParams.get(TRAININGS_URL_QUERY_KEYS.filterByDate);

  return (
    <Box sx={{ pt: "0.0rem", flexGrow: 0 }}>
      <Formik<FormikValuesType>
        initialValues={{
          "start-date": null,
          "end-date": null,
        }}
        validate={validateDates}
        onSubmit={async (values, actions) => {
          try {
            const startDate = values["start-date"] as any as Date;
            const endDate = values["end-date"] as any as Date;

            const searchUrl = updateUrlQuery(
              searchParams.toString(),
              TRAININGS_URL_QUERY_KEYS.filterByDate,
              "from-" + dateToString(startDate) + "-to-" + dateToString(endDate)
            );
            setSearchParams(searchUrl);
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        <Box>
          <Form noValidate>
            <Stack
              spacing={matchDownSm ? 1 : 3}
              direction={matchDownSm ? "column" : "row"}
              alignItems="center"
              justifyContent="center"
              sx={{ flexWrap: "wrap" }}
            >
              <InitializeDatesFromUrl dateFilter={dateFilter} />
              <Field
                name="start-date"
                component={DatePickerField}
                label="Start date"
              ></Field>
              <Field
                name="end-date"
                component={DatePickerField}
                label="End date"
              ></Field>
              <Box>
                <MuiButtonSubmitWithFormik
                  variant="outlined"
                  size="large"
                  sx={{}}
                >
                  Filter
                </MuiButtonSubmitWithFormik>

                {searchParams.get(TRAININGS_URL_QUERY_KEYS.filterByDate) ? (
                  <ClearFilterByDate
                    removeFilterByDateFromUrl={() => {
                      setSearchParams(
                        updateUrlQuery(
                          searchParams.toString(),
                          TRAININGS_URL_QUERY_KEYS.filterByDate
                        )
                      );
                    }}
                  />
                ) : null}
              </Box>
            </Stack>
          </Form>
        </Box>
      </Formik>
    </Box>
  );
};

export default FilterByDate;
