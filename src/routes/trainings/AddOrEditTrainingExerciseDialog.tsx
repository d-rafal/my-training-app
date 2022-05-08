import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import {
  ExerciseData,
  SeriesData,
  TrainingSessionDataFromApi,
} from "../../interfaces/trainingsInterf";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { MuiTextFieldPropsError } from "../auth/AuthSide";
import { nanoid } from "nanoid";
import DeleteIcon from "@mui/icons-material/Delete";
import { ExerciseDialogStateType } from "./Training";

import { useSetSnackbarContext } from "../../components/snackbar-provider/SnackbarProvider";

import { useMutation, useQueryClient } from "react-query";
import api from "../../api";
import useQueryUser from "../../react-query-hooks/useQueryUser";

import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
  UseFormSetValue,
  FieldPath,
  UseFormTrigger,
} from "react-hook-form";

const maxCommentSigns = 255;
const maxExerciseNameSigns = 100;

type Series = {
  [Property in keyof SeriesData]: SeriesData[Property] | "";
} & { key: string };

interface FormDataType {
  name: string;
  comment: string;
  series: Series[];
}

const TriggerManualFieldValidation = ({
  trigger,
  triggerNewSeriesValidation,
  indexForValidationTrigger,
}: {
  trigger: UseFormTrigger<FormDataType>;
  triggerNewSeriesValidation: boolean;
  indexForValidationTrigger: number | null;
}) => {
  // trigger manual validation for new series
  useEffect(() => {
    if (indexForValidationTrigger !== null) {
      trigger(`series.${indexForValidationTrigger}.quantity`, {
        // shouldFocus: true,
      });
    }
  }, [triggerNewSeriesValidation, indexForValidationTrigger, trigger]);

  // trigger manual validation for all field when form is first time loaded
  useEffect(() => {
    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

const acceptOnlyDigits = (
  e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  setValue: UseFormSetValue<FormDataType>,
  filedName: FieldPath<FormDataType>,
  allowDash = false
) => {
  if (e.target.value.match(/^\d*$/) || (allowDash && e.target.value === "-")) {
    setValue(filedName, e.target.value, { shouldValidate: true });
  }
};

const AddOrEditTrainingExerciseDialog = ({
  exerciseDialogState,
  setExerciseDialogState,
  trainingSession,
}: {
  exerciseDialogState: ExerciseDialogStateType;
  setExerciseDialogState: React.Dispatch<
    React.SetStateAction<ExerciseDialogStateType>
  >;
  trainingSession: TrainingSessionDataFromApi | undefined;
}) => {
  const setSnackbar = useSetSnackbarContext();

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const requestInProgress = useRef(false);

  const [indexForValidationTrigger, setIndexForValidationTrigger] = useState<
    number | null
  >(null);
  const [triggerNewSeriesValidation, setTriggerNewSeriesValidation] =
    useState<boolean>(false);

  const user = useQueryUser();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (exercises: ExerciseData[]) => {
      return api.trainings
        .updateExercises(
          trainingSession?._id ? trainingSession._id : "",
          exercises,
          location.search
        )
        .then(
          (res) => res,
          (error) => {
            throw error;
          }
        );
    },
    {
      onSuccess: (data, variables, context) => {
        if (user) {
          queryClient.setQueryData(
            ["trainings", { search: searchParams.toString() }],
            data
          );
        }

        setSnackbar(
          exerciseDialogState.initialValues
            ? "Exercise Updated"
            : "Exercise Added",
          "success"
        );
      },
      onError: (error, variables, context) => {
        console.error("Failed to add exercise:", error);
        setSnackbar("Failed to add exercise", "error", undefined, true);
      },
      onSettled: (data, error, variables, context) => {
        closeDialog();
      },
    }
  );

  const {
    handleSubmit,
    setValue,
    control,
    trigger,
    formState: { isSubmitting, isValid },
  } = useForm<FormDataType>({
    defaultValues: exerciseDialogState.initialValues
      ? {
          name: exerciseDialogState.initialValues.name,
          comment: exerciseDialogState.initialValues.comment,
          series: exerciseDialogState.initialValues.series.reduce<Series[]>(
            (previousValue, currentValue) =>
              previousValue.concat([
                {
                  key: nanoid(),
                  // key: currentValue._id,
                  load: currentValue.load,
                  quantity: currentValue.quantity,
                },
              ]),
            []
          ),
        }
      : {
          name: "",
          comment: "",
          series: [] as Series[],
        },
    mode: "all",
    criteriaMode: "firstError",
    shouldUnregister: true,
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "series",
    shouldUnregister: true,
  });

  const onSubmit: SubmitHandler<FormDataType> = async (values) => {
    // protection against submitting form twice
    if (!requestInProgress.current) {
      requestInProgress.current = true;

      try {
        const exercises_shallowCopyForMutation: ExerciseData[] = [
          ...(trainingSession?.exercises ?? []),
        ];
        exercises_shallowCopyForMutation.splice(
          (exerciseDialogState.index ?? trainingSession?.exercises.length) || 0,
          exerciseDialogState.initialValues ? 1 : 0,
          {
            ...(exerciseDialogState?.initialValues?._id
              ? { _id: exerciseDialogState.initialValues._id }
              : undefined),
            name: values.name ?? "",
            comment: values.comment ?? "",
            series:
              values.series.reduce<SeriesData[]>(
                (previousValue, currentValue) =>
                  previousValue.concat([
                    {
                      load:
                        currentValue.load === "-" || !currentValue.load
                          ? 0
                          : currentValue.load,
                      quantity: !currentValue.quantity
                        ? 0
                        : currentValue.quantity,
                    },
                  ]),
                []
              ) ?? [],
          }
        );

        await mutation.mutateAsync(exercises_shallowCopyForMutation);
      } finally {
        requestInProgress.current = false;
      }
    }
  };

  const closeDialog = () => {
    setExerciseDialogState({ open: false });
  };

  return (
    <Dialog
      open={exerciseDialogState.open}
      onClose={closeDialog}
      scroll="paper"
      aria-labelledby="add-edit-exercise-dialog-title"
      sx={{ margin: "0rem" }}
    >
      <DialogTitle id="add-edit-exercise-dialog-title">
        {exerciseDialogState.initialValues ? "Update Exercise" : "Add Exercise"}
        <IconButton
          aria-label="close"
          onClick={closeDialog}
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
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          dividers={true}
          sx={{ opacity: mutation.isLoading ? 0.5 : 1 }}
        >
          <Stack spacing={0} direction="column" alignItems="center">
            <Controller
              render={({ field, fieldState, formState }) => (
                <TextField
                  id="name"
                  margin="dense"
                  fullWidth
                  label="Exercise name"
                  variant="filled"
                  inputProps={{ maxLength: maxExerciseNameSigns }}
                  autoFocus
                  {...MuiTextFieldPropsError(field, fieldState)}
                />
              )}
              name="name"
              control={control}
              rules={{
                required: "Required",
                maxLength: {
                  value: maxExerciseNameSigns,
                  message: `Max length is ${maxExerciseNameSigns} characters`,
                },
              }}
            />

            <Controller
              render={({ field, fieldState, formState }) => (
                <TextField
                  id="comment"
                  margin="dense"
                  fullWidth
                  label="Exercise comment"
                  multiline
                  variant="filled"
                  inputProps={{ maxLength: maxCommentSigns }}
                  {...MuiTextFieldPropsError(field, fieldState)}
                />
              )}
              name="comment"
              control={control}
              rules={{
                maxLength: {
                  value: maxCommentSigns,
                  message: `Max length is ${maxCommentSigns} characters`,
                },
              }}
            />

            {fields && fields.length > 0 ? (
              <Stack>
                <TableContainer
                  component="table"
                  sx={{
                    "& .MuiTableCell-root": {
                      padding: "0 0.25rem",
                      textAlign: "center",
                    },
                    "& .MuiTableCell-body": {
                      padding: "0.4rem 0.25rem",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Nr</TableCell>
                      <TableCell>Load&nbsp;(kg)</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <IconButton
                            type="button"
                            aria-label="delete series"
                            onClick={() => remove(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h5"> {index + 1}</Typography>
                        </TableCell>
                        <TableCell>
                          <Controller
                            render={({ field, fieldState, formState }) => (
                              <TextField
                                hiddenLabel
                                size="small"
                                required
                                variant="filled"
                                inputProps={{
                                  maxLength: 3,
                                }}
                                sx={{
                                  width: "3.5rem",
                                  transform: "translateY(0.7rem)",
                                  "& .MuiFormHelperText-root": {
                                    ml: "0.1rem",
                                    mt: "0.1rem",
                                  },
                                  "& .MuiFilledInput-input": {
                                    textAlign: "center",
                                  },
                                }}
                                {...MuiTextFieldPropsError(field, fieldState)}
                                onChange={(e) => {
                                  acceptOnlyDigits(
                                    e,
                                    setValue,
                                    field.name,
                                    true
                                  );
                                }}
                              />
                            )}
                            name={`series.${index}.load` as const}
                            control={control}
                            rules={{
                              validate: {
                                inAllowRange: (value) => {
                                  if (value !== "-") {
                                    const quantity = Number(value);
                                    if (
                                      Number.isNaN(quantity) ||
                                      quantity < 0 ||
                                      quantity > 999
                                    ) {
                                      return "<0,999>";
                                    }
                                  }
                                  return true;
                                },
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            render={({ field, fieldState, formState }) => (
                              <TextField
                                hiddenLabel
                                size="small"
                                required
                                variant="filled"
                                inputProps={{
                                  maxLength: 3,
                                }}
                                sx={{
                                  width: "3.5rem",
                                  transform: "translateY(0.7rem)",
                                  "& .MuiFormHelperText-root": {
                                    ml: "0.1rem",
                                    mt: "0.1rem",
                                  },
                                  "& .MuiFilledInput-input": {
                                    textAlign: "center",
                                  },
                                }}
                                {...MuiTextFieldPropsError(field, fieldState)}
                                onChange={(e) => {
                                  acceptOnlyDigits(
                                    e,
                                    setValue,
                                    field.name,
                                    false
                                  );
                                }}
                              />
                            )}
                            name={`series.${index}.quantity` as const}
                            control={control}
                            rules={{
                              required: "Required",
                              validate: {
                                inAllowRange: (value) => {
                                  const quantity = Number(value);
                                  if (
                                    Number.isNaN(quantity) ||
                                    quantity < 1 ||
                                    quantity > 999
                                  ) {
                                    return "<1,999>";
                                  }
                                  return true;
                                },
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            type="button"
                            aria-label="add series"
                            onClick={() => {
                              insert(index, {
                                key: nanoid(),
                                load: "",
                                quantity: "",
                              });

                              setIndexForValidationTrigger(index);
                              setTriggerNewSeriesValidation((value) => !value);
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableContainer>
              </Stack>
            ) : undefined}

            <Button
              type="button"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                append({
                  key: nanoid(),
                  load: "",
                  quantity: "",
                });

                setIndexForValidationTrigger(fields.length);
                setTriggerNewSeriesValidation((value) => !value);
              }}
              sx={{
                mt: fields.length > 0 ? "1.6rem" : "0.4rem",
                mb: "0.8rem",
              }}
            >
              Add series
            </Button>
          </Stack>
          <TriggerManualFieldValidation
            trigger={trigger}
            triggerNewSeriesValidation={triggerNewSeriesValidation}
            indexForValidationTrigger={indexForValidationTrigger}
          />
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={closeDialog}>
            Cancel
          </Button>

          <Button
            type="submit"
            size="large"
            disabled={isSubmitting || !isValid || mutation.isLoading}
          >
            {mutation.isLoading && (
              <CircularProgress size={24} sx={{ mr: "0.5rem" }} />
            )}
            {exerciseDialogState.initialValues ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddOrEditTrainingExerciseDialog;
