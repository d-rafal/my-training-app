import { DatePicker, DatePickerProps } from "@mui/lab";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useSearchParams } from "react-router-dom";
import updateUrlQuery from "../../auxiliary/updateUrlQuery";
import { dateToString } from "../../auxiliary/date/dateToString";
import { TRAININGS_URL_QUERY_KEYS } from "./trainingsConsts";
import { stringToDate } from "../../auxiliary/date/stringToDate";
import { OrNull } from "../../interfaces/generalInterf";
import { isDateValid } from "../../auxiliary/date/isDateValid";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useEffect } from "react";

import {
  useForm,
  Controller,
  ControllerRenderProps,
  ControllerFieldState,
  SubmitHandler,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";

interface FormDataType {
  "start-date": OrNull<Date>;
  "end-date": OrNull<Date>;
}

const minAllowedDate = new Date(Date.UTC(2000, 1, 1, 0, 0, 0));

const ClearFilterByDate = ({
  removeFilterByDateFromUrl,
  reset,
}: {
  removeFilterByDateFromUrl: () => void;
  reset: UseFormReset<FormDataType>;
}) => {
  return (
    <IconButton
      type="button"
      aria-label="clear filter"
      onClick={() => {
        reset();
        removeFilterByDateFromUrl();
      }}
    >
      <HighlightOffIcon sx={{ fontSize: "3rem" }} />
    </IconButton>
  );
};

const useInitializeDatesFromUrl = (
  dateFilter: string | null,
  setValue: UseFormSetValue<FormDataType>
) => {
  useEffect(() => {
    const updateDateInFormikValues = (
      urlDate: string,
      propName: keyof FormDataType
    ) => {
      const date = stringToDate(urlDate);
      if (isDateValid(date)) {
        setValue(propName, date, { shouldValidate: true });
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
      setValue("start-date", null);
      setValue("end-date", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  return null;
};

export const commonDateValidation = {
  validDate: (date: FormDataType["start-date"]) =>
    (!!date && isDateValid(date)) || "Enter valid date",
  notFutureDate: (date: FormDataType["start-date"]) =>
    (!!date && date < new Date()) || "Future date not allowed",
  notBeforeMinAllowedDate: (date: FormDataType["start-date"]) =>
    (!!date && date > minAllowedDate) ||
    `Date before ${
      minAllowedDate.toLocaleString("pl-PL", { timeZone: "UTC" }).split(",")[0]
    }`,
};
interface DatePickerFieldProps<T> extends DatePickerProps {
  field: ControllerRenderProps<T, any>;
  fieldState: ControllerFieldState;
  getShouldDisableDateError?: (date: Date) => string;
}

export function DatePickerField<T>({
  field,
  fieldState,
  ...other
}: Omit<
  DatePickerFieldProps<T>,
  "value" | "onChange" | "renderInput" | "inputRef"
>) {
  return (
    <DatePicker
      mask={"__.__.____"}
      disableFuture
      allowSameDateSelection
      openTo="month"
      views={["year", "month", "day"]}
      minDate={minAllowedDate}
      value={field.value}
      onChange={field.onChange}
      inputRef={field.ref}
      renderInput={(params) => (
        <TextField
          {...params}
          name={field.name}
          variant="standard"
          error={fieldState.invalid}
          helperText={fieldState.invalid ? fieldState.error?.message : " "}
          onBlur={field.onBlur}
        />
      )}
      {...other}
    />
  );
}

const FilterByDate = () => {
  const theme = useTheme();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const {
    handleSubmit,
    reset,
    setValue,
    control,

    watch,
  } = useForm<FormDataType>({
    defaultValues: {
      "start-date": null,
      "end-date": null,
    },
    mode: "all",
    criteriaMode: "firstError",
    shouldUnregister: true,
  });

  const startDate = watch("start-date");

  const dateFilter = searchParams.get(TRAININGS_URL_QUERY_KEYS.filterByDate);

  useInitializeDatesFromUrl(dateFilter, setValue);

  const onSubmit: SubmitHandler<FormDataType> = async (values) => {
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
    }
  };

  return (
    <Box sx={{ pt: "0.0rem", flexGrow: 0 }}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack
          spacing={matchDownSm ? 1 : 3}
          direction={matchDownSm ? "column" : "row"}
          alignItems="center"
          justifyContent="center"
          sx={{ flexWrap: "wrap" }}
        >
          <Controller
            render={({ field, fieldState, formState }) => (
              <DatePickerField
                field={field}
                fieldState={fieldState}
                label="Start date"
              />
            )}
            name="start-date"
            control={control}
            rules={{
              validate: {
                ...commonDateValidation,
              },
            }}
          />
          <Controller
            render={({ field, fieldState, formState }) => (
              <DatePickerField
                field={field}
                fieldState={fieldState}
                label="End date"
              />
            )}
            name="end-date"
            control={control}
            rules={{
              validate: {
                ...commonDateValidation,
                afterStartDate: (date) =>
                  (date !== null && startDate !== null && date > startDate) ||
                  "End date after start date",
              },
            }}
          />
          <Box>
            <Button type="submit" size="large" variant="outlined">
              Filter
            </Button>

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
                reset={reset}
              />
            ) : null}
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default FilterByDate;
