import {
  Button,
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
import { useLocation } from "react-router-dom";

import {
  ExerciseData,
  ExerciseDataFromApi,
  SeriesData,
  TrainingSessionDataFromApi,
} from "../../interfaces/trainingsInterf";
import { updateExercises } from "../../store/features/trainings/trainingsActionCreators";
import { useAppDispatch } from "../../store/hooks/hooks";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Field,
  FieldArray,
  FieldInputProps,
  FieldProps,
  Form,
  Formik,
  FormikErrors,
  FormikProps,
} from "formik";

import MuiButtonSubmitWithFormik from "../../components/mui/button-submit-with-formik/MuiButtonSubmitWithFormik";
import { MuiTextFieldPropsFromFormikField } from "../auth/AuthSide";
import { nanoid } from "@reduxjs/toolkit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ExerciseDialogStateType } from "./Training";

import { useSelectActionStatusAndError } from "../../store/features/trainings/trainingsSlice";
import { useSetSnackbarContext } from "../../components/snackbar-provider/SnackbarProvider";

const maxCommentSigns = 255;
const maxExerciseNameSigns = 100;

interface Series extends SeriesData {
  key: string;
}
interface FormikValuesType {
  _id?: string;
  name: string;
  comment: string;
  series: Series[];
}

const acceptOnlyDigits = (
  e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  form: FormikProps<any>,
  field: FieldInputProps<any>,
  allowDash = false
) => {
  if (e.target.value.match(/^\d*$/) || (allowDash && e.target.value === "-")) {
    form.setFieldValue(field.name, e.target.value);
  }
};

const validate = (values: FormikValuesType) => {
  const errors: FormikErrors<FormikValuesType> = {};

  if (!values.name.length) {
    errors.name = "Required";
  }
  if (values.name.length > maxExerciseNameSigns) {
    errors.name = `Max ${maxExerciseNameSigns} signs`;
  }

  if (values.comment.length > maxCommentSigns) {
    errors.comment = `Max ${maxCommentSigns} signs`;
  }

  errors.series = [];

  values.series.forEach((element: SeriesData, index: number) => {
    if (element.load !== "-") {
      const load = Number(element.load);

      if (Number.isNaN(load) || load < 0 || load > 999) {
        // @ts-ignore
        errors.series[index] = { load: "<0,999>" };
      }
    }

    const quantity = Number(element.quantity);
    if ((element.quantity as any as string) === "") {
      // @ts-ignore
      errors.series[index] = {
        // @ts-ignore
        ...errors.series[index],
        quantity: "Required",
      };
    } else if (Number.isNaN(quantity) || quantity < 1 || quantity > 999) {
      // @ts-ignore
      errors.series[index] = {
        // @ts-ignore
        ...errors.series[index],
        quantity: "<1,999>",
      };
    }
  });

  if (!errors.series.length) {
    delete errors.series;
  }

  return errors;
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

  const [actionStatus] = useSelectActionStatusAndError();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const requestInProgress = useRef(false);

  const [indexForAutofocus, setIndexAutofocus] = useState<number | null>(null);

  const elementToAutofocus = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (elementToAutofocus.current) {
      elementToAutofocus?.current?.focus();
      elementToAutofocus.current = null;
      setIndexAutofocus(null);
    }
  }, [elementToAutofocus, indexForAutofocus]);

  const closeDialog = () => {
    setExerciseDialogState({ open: false });
  };

  const addUpdateExercise = async (exercises: ExerciseData[]) => {
    try {
      await dispatch(
        updateExercises({
          _id: trainingSession?._id ? trainingSession._id : "",
          exercises: exercises,
          urlQuery: location.search,
        })
      ).unwrap();
      setSnackbar(
        exerciseDialogState.initialValues
          ? "Exercise Updated"
          : "Exercise Added",
        "success"
      );
    } catch (error) {
      console.error("Failed to add exercise: ", error);
    } finally {
      closeDialog();
    }
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
      <Formik<FormikValuesType>
        initialValues={
          exerciseDialogState.initialValues
            ? {
                _id: exerciseDialogState.initialValues._id,
                name: exerciseDialogState.initialValues.name,
                comment: exerciseDialogState.initialValues.comment,
                series: exerciseDialogState.initialValues.series.reduce<
                  Series[]
                >(
                  (previousValue, currentValue) =>
                    previousValue.concat([
                      {
                        key: nanoid(),
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
              }
        }
        validate={validate}
        onSubmit={async (values, actions) => {
          // protection against submitting form twice
          if (!requestInProgress.current) {
            requestInProgress.current = true;

            try {
              const exercises_shallowCopyForMutation: (
                | ExerciseDataFromApi
                | (Pick<ExerciseDataFromApi, "name" | "comment"> &
                    Partial<Pick<ExerciseDataFromApi, "_id">> & {
                      series: Omit<Series, "key">[];
                    })
              )[] = [...(trainingSession?.exercises ?? [])];
              exercises_shallowCopyForMutation.splice(
                (exerciseDialogState.index ??
                  trainingSession?.exercises.length) ||
                  0,
                exerciseDialogState.initialValues ? 1 : 0,
                {
                  ...(values._id ? { _id: values._id } : undefined),
                  name: values.name ?? "",
                  comment: values.comment ?? "",
                  series:
                    values.series?.reduce<Omit<Series, "key">[]>(
                      (previousValue, currentValue) =>
                        previousValue.concat([
                          {
                            load:
                              currentValue.load === "-" || !currentValue.load
                                ? 0
                                : currentValue.load,
                            quantity: currentValue.quantity,
                          },
                        ]),
                      []
                    ) ?? [],
                }
              );

              await addUpdateExercise(exercises_shallowCopyForMutation);
            } finally {
              requestInProgress.current = false;
              actions.setSubmitting(false);
            }
          }
        }}
      >
        <Form noValidate autoComplete="off">
          <DialogContent
            dividers={true}
            sx={{ opacity: actionStatus === "PROCESSING" ? 0.5 : 1 }}
          >
            <Stack spacing={0} direction="column" alignItems="center">
              <Field name="name">
                {({ field, form, meta }: FieldProps) => (
                  <TextField
                    {...MuiTextFieldPropsFromFormikField(field, meta)}
                    margin="dense"
                    fullWidth
                    label="Exercise name"
                    variant="filled"
                    inputProps={{ maxLength: maxExerciseNameSigns }}
                    autoFocus
                  />
                )}
              </Field>
              <Field name="comment">
                {({ field, form, meta }: FieldProps) => (
                  <TextField
                    {...MuiTextFieldPropsFromFormikField(field, meta)}
                    margin="dense"
                    fullWidth
                    label="Exercise comment"
                    multiline
                    variant="filled"
                    inputProps={{ maxLength: maxCommentSigns }}
                  />
                )}
              </Field>
              <FieldArray name="series">
                {({ remove, move, swap, push, insert, unshift, pop, form }) => {
                  return (
                    <>
                      {form.values.series && form.values.series.length > 0 ? (
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
                              {form.values.series.map(
                                (_: any, index: number) => (
                                  <TableRow key={`series.[${index}].key`}>
                                    <TableCell>
                                      <IconButton
                                        aria-label="delete series"
                                        onClick={() => remove(index)}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="h5">
                                        {" "}
                                        {index + 1}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Field name={`series.[${index}].load`}>
                                        {({
                                          field,
                                          form,
                                          meta,
                                        }: FieldProps) => (
                                          <TextField
                                            {...MuiTextFieldPropsFromFormikField(
                                              field,
                                              meta
                                            )}
                                            onChange={(e) => {
                                              acceptOnlyDigits(
                                                e,
                                                form,
                                                field,
                                                true
                                              );
                                            }}
                                            hiddenLabel
                                            size="small"
                                            required
                                            variant="filled"
                                            inputProps={{
                                              maxLength: 3,
                                            }}
                                            inputRef={
                                              indexForAutofocus === index
                                                ? elementToAutofocus
                                                : null
                                            }
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
                                          />
                                        )}
                                      </Field>
                                    </TableCell>
                                    <TableCell>
                                      <Field
                                        name={`series.[${index}].quantity`}
                                      >
                                        {({
                                          field,
                                          form,
                                          meta,
                                        }: FieldProps) => (
                                          <TextField
                                            {...MuiTextFieldPropsFromFormikField(
                                              field,
                                              meta
                                            )}
                                            onChange={(e) => {
                                              acceptOnlyDigits(e, form, field);
                                            }}
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
                                          />
                                        )}
                                      </Field>
                                    </TableCell>
                                    <TableCell>
                                      <IconButton
                                        aria-label="add series"
                                        onClick={() => {
                                          insert(index, {
                                            key: nanoid(),
                                            load: "",
                                            quantity: "",
                                          });

                                          setIndexAutofocus(index);
                                        }}
                                      >
                                        <AddIcon />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </TableContainer>
                        </Stack>
                      ) : undefined}

                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          push({
                            key: nanoid(),
                            load: "",
                            quantity: "",
                          });
                          setIndexAutofocus(form.values.series.length);
                        }}
                        sx={{
                          mt:
                            form.values.series.length > 0 ? "1.6rem" : "0.4rem",
                          mb: "0.8rem",
                        }}
                      >
                        Add series
                      </Button>
                    </>
                  );
                }}
              </FieldArray>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <MuiButtonSubmitWithFormik size="large" actionStatus={actionStatus}>
              {exerciseDialogState.initialValues ? "Update" : "Add"}
            </MuiButtonSubmitWithFormik>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default AddOrEditTrainingExerciseDialog;
