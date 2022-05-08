import { nanoid } from "nanoid";
import { rest } from "msw";
import tryConvertToFiniteNumber from "../auxiliary/tryConvertToFiniteNumber";
import {
  ExerciseDataFromApi,
  SeriesDataFromApi,
} from "../interfaces/trainingsInterf";
import { ARTIFICIAL_DELAY_MS } from "./server";

let dbTrainings = [
  {
    _id: nanoid(),
    date: new Date(2022, 2, 29, 18).toISOString(),
    comment: "",
    exercises: [
      {
        _id: nanoid(),
        name: "Podciąganie na drązku",
        comment: "",
        series: [
          { _id: nanoid(), load: 0, quantity: 10 },
          { _id: nanoid(), load: 5, quantity: 8 },
          { _id: nanoid(), load: 10, quantity: 5 },
        ],
      },
      {
        _id: nanoid(),
        name: "Wiosłowanie hantlą w opadzie tułowia",
        comment: "",
        series: [
          { _id: nanoid(), load: 22, quantity: 12 },
          { _id: nanoid(), load: 32, quantity: 10 },
          { _id: nanoid(), load: 40, quantity: 7 },
        ],
      },
      {
        _id: nanoid(),
        name: "dipy",
        comment: "",
        series: [
          { _id: nanoid(), load: 0, quantity: 12 },
          { _id: nanoid(), load: 12, quantity: 10 },
          { _id: nanoid(), load: 26, quantity: 8 },
        ],
      },
      {
        _id: nanoid(),
        name: "Wyciskanie sztangi nad głowę",
        comment: "",
        series: [
          { _id: nanoid(), load: 30, quantity: 12 },
          { _id: nanoid(), load: 45, quantity: 10 },
          { _id: nanoid(), load: 55, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie ramion z hantlami z rotacją",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 16, quantity: 10 },
          { _id: nanoid(), load: 20, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka podchwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 14, quantity: 10 },
          { _id: nanoid(), load: 18, quantity: 7 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka nachwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 8, quantity: 12 },
          { _id: nanoid(), load: 10, quantity: 10 },
          { _id: nanoid(), load: 12, quantity: 7 },
        ],
      },
    ],
  },
  {
    _id: nanoid(),
    date: new Date(2022, 2, 31, 18).toISOString(),
    comment: "",
    exercises: [
      {
        _id: nanoid(),
        name: "Martwy ciąg",
        comment: "",
        series: [
          { _id: nanoid(), load: 50, quantity: 12 },
          { _id: nanoid(), load: 60, quantity: 10 },
          { _id: nanoid(), load: 75, quantity: 8 },
          { _id: nanoid(), load: 85, quantity: 6 },
          { _id: nanoid(), load: 100, quantity: 3 },
        ],
      },
      {
        _id: nanoid(),
        name: "Unoszenie ramion w bok ze sztangielkami",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 15, quantity: 10 },
          { _id: nanoid(), load: 18, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Pompki",
        comment: "",
        series: [
          { _id: nanoid(), load: 0, quantity: 20 },
          { _id: nanoid(), load: 0, quantity: 18 },
          { _id: nanoid(), load: 0, quantity: 16 },
        ],
      },
      {
        _id: nanoid(),
        name: "Zginanie przedramion ze sztangą stojąc",
        comment: "",
        series: [
          { _id: nanoid(), load: 20, quantity: 12 },
          { _id: nanoid(), load: 30, quantity: 10 },
          { _id: nanoid(), load: 40, quantity: 5 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie ramion z hantlami z rotacją",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 16, quantity: 10 },
          { _id: nanoid(), load: 20, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka podchwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 14, quantity: 10 },
          { _id: nanoid(), load: 18, quantity: 7 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka nachwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 8, quantity: 12 },
          { _id: nanoid(), load: 10, quantity: 10 },
          { _id: nanoid(), load: 12, quantity: 7 },
        ],
      },
    ],
  },
  {
    _id: nanoid(),
    date: new Date(2022, 3, 2, 18).toISOString(),
    comment: "",
    exercises: [
      {
        _id: nanoid(),
        name: "Podciąganie na drązku",
        comment: "",
        series: [
          { _id: nanoid(), load: 0, quantity: 10 },
          { _id: nanoid(), load: 5, quantity: 8 },
          { _id: nanoid(), load: 10, quantity: 5 },
        ],
      },
      {
        _id: nanoid(),
        name: "Wiosłowanie hantlą w opadzie tułowia",
        comment: "",
        series: [
          { _id: nanoid(), load: 22, quantity: 12 },
          { _id: nanoid(), load: 32, quantity: 10 },
          { _id: nanoid(), load: 40, quantity: 7 },
        ],
      },
      {
        _id: nanoid(),
        name: "dipy",
        comment: "",
        series: [
          { _id: nanoid(), load: 0, quantity: 12 },
          { _id: nanoid(), load: 12, quantity: 10 },
          { _id: nanoid(), load: 26, quantity: 8 },
        ],
      },
      {
        _id: nanoid(),
        name: "Wyciskanie sztangi nad głowę",
        comment: "",
        series: [
          { _id: nanoid(), load: 30, quantity: 12 },
          { _id: nanoid(), load: 45, quantity: 10 },
          { _id: nanoid(), load: 55, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie ramion z hantlami z rotacją",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 16, quantity: 10 },
          { _id: nanoid(), load: 20, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka podchwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 14, quantity: 10 },
          { _id: nanoid(), load: 18, quantity: 7 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka nachwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 8, quantity: 12 },
          { _id: nanoid(), load: 10, quantity: 10 },
          { _id: nanoid(), load: 12, quantity: 7 },
        ],
      },
    ],
  },
  {
    _id: nanoid(),
    date: new Date(2022, 3, 4, 18).toISOString(),
    comment: "",
    exercises: [
      {
        _id: nanoid(),
        name: "Martwy ciąg",
        comment: "",
        series: [
          { _id: nanoid(), load: 50, quantity: 12 },
          { _id: nanoid(), load: 60, quantity: 10 },
          { _id: nanoid(), load: 75, quantity: 8 },
          { _id: nanoid(), load: 85, quantity: 6 },
          { _id: nanoid(), load: 100, quantity: 3 },
        ],
      },
      {
        _id: nanoid(),
        name: "Unoszenie ramion w bok ze sztangielkami",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 15, quantity: 10 },
          { _id: nanoid(), load: 18, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Pompki",
        comment: "",
        series: [
          { _id: nanoid(), load: 0, quantity: 20 },
          { _id: nanoid(), load: 0, quantity: 18 },
          { _id: nanoid(), load: 0, quantity: 16 },
        ],
      },
      {
        _id: nanoid(),
        name: "Zginanie przedramion ze sztangą stojąc",
        comment: "",
        series: [
          { _id: nanoid(), load: 20, quantity: 12 },
          { _id: nanoid(), load: 30, quantity: 10 },
          { _id: nanoid(), load: 40, quantity: 5 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie ramion z hantlami z rotacją",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 16, quantity: 10 },
          { _id: nanoid(), load: 20, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka podchwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 14, quantity: 10 },
          { _id: nanoid(), load: 18, quantity: 7 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka nachwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 8, quantity: 12 },
          { _id: nanoid(), load: 10, quantity: 10 },
          { _id: nanoid(), load: 12, quantity: 7 },
        ],
      },
    ],
  },
  {
    _id: nanoid(),
    date: new Date(2022, 3, 6, 18).toISOString(),
    comment: "",
    exercises: [
      {
        _id: nanoid(),
        name: "Podciąganie na drązku",
        comment: "",
        series: [
          { _id: nanoid(), load: 0, quantity: 10 },
          { _id: nanoid(), load: 5, quantity: 8 },
          { _id: nanoid(), load: 10, quantity: 5 },
        ],
      },
      {
        _id: nanoid(),
        name: "Wiosłowanie hantlą w opadzie tułowia",
        comment: "",
        series: [
          { _id: nanoid(), load: 22, quantity: 12 },
          { _id: nanoid(), load: 32, quantity: 10 },
          { _id: nanoid(), load: 40, quantity: 7 },
        ],
      },
      {
        _id: nanoid(),
        name: "dipy",
        comment: "",
        series: [
          { _id: nanoid(), load: 0, quantity: 12 },
          { _id: nanoid(), load: 12, quantity: 10 },
          { _id: nanoid(), load: 26, quantity: 8 },
        ],
      },
      {
        _id: nanoid(),
        name: "Wyciskanie sztangi nad głowę",
        comment: "",
        series: [
          { _id: nanoid(), load: 30, quantity: 12 },
          { _id: nanoid(), load: 45, quantity: 10 },
          { _id: nanoid(), load: 55, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie ramion z hantlami z rotacją",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 16, quantity: 10 },
          { _id: nanoid(), load: 20, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka podchwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 14, quantity: 10 },
          { _id: nanoid(), load: 18, quantity: 7 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka nachwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 8, quantity: 12 },
          { _id: nanoid(), load: 10, quantity: 10 },
          { _id: nanoid(), load: 12, quantity: 7 },
        ],
      },
    ],
  },
  {
    _id: nanoid(),
    date: new Date(2022, 3, 8, 18).toISOString(),
    comment: "",
    exercises: [
      {
        _id: nanoid(),
        name: "Martwy ciąg",
        comment: "",
        series: [
          { _id: nanoid(), load: 50, quantity: 12 },
          { _id: nanoid(), load: 60, quantity: 10 },
          { _id: nanoid(), load: 75, quantity: 8 },
          { _id: nanoid(), load: 85, quantity: 6 },
          { _id: nanoid(), load: 100, quantity: 3 },
        ],
      },
      {
        _id: nanoid(),
        name: "Unoszenie ramion w bok ze sztangielkami",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 15, quantity: 10 },
          { _id: nanoid(), load: 18, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Pompki",
        comment: "",
        series: [
          { _id: nanoid(), load: 0, quantity: 20 },
          { _id: nanoid(), load: 0, quantity: 18 },
          { _id: nanoid(), load: 0, quantity: 16 },
        ],
      },
      {
        _id: nanoid(),
        name: "Zginanie przedramion ze sztangą stojąc",
        comment: "",
        series: [
          { _id: nanoid(), load: 20, quantity: 12 },
          { _id: nanoid(), load: 30, quantity: 10 },
          { _id: nanoid(), load: 40, quantity: 5 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie ramion z hantlami z rotacją",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 16, quantity: 10 },
          { _id: nanoid(), load: 20, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka podchwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 14, quantity: 10 },
          { _id: nanoid(), load: 18, quantity: 7 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka nachwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 8, quantity: 12 },
          { _id: nanoid(), load: 10, quantity: 10 },
          { _id: nanoid(), load: 12, quantity: 7 },
        ],
      },
    ],
  },
  {
    _id: nanoid(),
    date: new Date(2022, 3, 10, 18).toISOString(),
    comment: "",
    exercises: [
      {
        _id: nanoid(),
        name: "Podciąganie na drązku",
        comment: "",
        series: [
          { _id: nanoid(), load: 0, quantity: 10 },
          { _id: nanoid(), load: 5, quantity: 8 },
          { _id: nanoid(), load: 10, quantity: 5 },
        ],
      },
      {
        _id: nanoid(),
        name: "Wiosłowanie hantlą w opadzie tułowia",
        comment: "",
        series: [
          { _id: nanoid(), load: 22, quantity: 12 },
          { _id: nanoid(), load: 32, quantity: 10 },
          { _id: nanoid(), load: 40, quantity: 7 },
        ],
      },
      {
        _id: nanoid(),
        name: "dipy",
        comment: "",
        series: [
          { _id: nanoid(), load: 0, quantity: 12 },
          { _id: nanoid(), load: 12, quantity: 10 },
          { _id: nanoid(), load: 26, quantity: 8 },
        ],
      },
      {
        _id: nanoid(),
        name: "Wyciskanie sztangi nad głowę",
        comment: "",
        series: [
          { _id: nanoid(), load: 30, quantity: 12 },
          { _id: nanoid(), load: 45, quantity: 10 },
          { _id: nanoid(), load: 55, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie ramion z hantlami z rotacją",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 16, quantity: 10 },
          { _id: nanoid(), load: 20, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka podchwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 14, quantity: 10 },
          { _id: nanoid(), load: 18, quantity: 7 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka nachwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 8, quantity: 12 },
          { _id: nanoid(), load: 10, quantity: 10 },
          { _id: nanoid(), load: 12, quantity: 7 },
        ],
      },
    ],
  },
  {
    _id: nanoid(),
    date: new Date(2022, 3, 12, 18).toISOString(),
    comment: "",
    exercises: [
      {
        _id: nanoid(),
        name: "Martwy ciąg",
        comment: "",
        series: [
          { _id: nanoid(), load: 50, quantity: 12 },
          { _id: nanoid(), load: 60, quantity: 10 },
          { _id: nanoid(), load: 75, quantity: 8 },
          { _id: nanoid(), load: 85, quantity: 6 },
          { _id: nanoid(), load: 100, quantity: 3 },
        ],
      },
      {
        _id: nanoid(),
        name: "Unoszenie ramion w bok ze sztangielkami",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 15, quantity: 10 },
          { _id: nanoid(), load: 18, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Pompki",
        comment: "",
        series: [
          { _id: nanoid(), load: 0, quantity: 20 },
          { _id: nanoid(), load: 0, quantity: 18 },
          { _id: nanoid(), load: 0, quantity: 16 },
        ],
      },
      {
        _id: nanoid(),
        name: "Zginanie przedramion ze sztangą stojąc",
        comment: "",
        series: [
          { _id: nanoid(), load: 20, quantity: 12 },
          { _id: nanoid(), load: 30, quantity: 10 },
          { _id: nanoid(), load: 40, quantity: 5 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie ramion z hantlami z rotacją",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 16, quantity: 10 },
          { _id: nanoid(), load: 20, quantity: 6 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka podchwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 12, quantity: 12 },
          { _id: nanoid(), load: 14, quantity: 10 },
          { _id: nanoid(), load: 18, quantity: 7 },
        ],
      },
      {
        _id: nanoid(),
        name: "Uginanie oraz prostowanie nadgarstka nachwytem",
        comment: "",
        series: [
          { _id: nanoid(), load: 8, quantity: 12 },
          { _id: nanoid(), load: 10, quantity: 10 },
          { _id: nanoid(), load: 12, quantity: 7 },
        ],
      },
    ],
  },
];

const getTrainingsWithQuery = (
  searchQuery?: string,
  pageFromReq?: string,
  nrOfItems?: string,
  sortDateOrder?: string,
  filterByDate?: string
) => {
  const pageBase = 1;
  let trainings = dbTrainings.slice();

  let limit = tryConvertToFiniteNumber(nrOfItems);
  if (limit === null || limit === 0) limit = 5;

  let page = tryConvertToFiniteNumber(pageFromReq);
  if (page === null || page === 0) page = 1;

  let strtIndex = (page - pageBase) * limit;

  if (filterByDate) {
    const dates = (filterByDate as string).match(/\d{4}-\d{2}-\d{2}/g);

    const endDate = new Date(dates?.[1] as string);
    endDate.setDate(endDate.getDate() + 1);

    trainings = trainings.filter((training) => {
      const date = new Date(training.date);

      return date >= new Date(dates?.[0] as string) && date <= endDate;
    });
  }

  if (sortDateOrder && sortDateOrder.includes("asc")) {
    trainings.sort((a, b) => a.date.localeCompare(b.date));
  } else {
    trainings.sort((a, b) => b.date.localeCompare(a.date));
  }

  while (strtIndex > trainings.length - 1) {
    strtIndex -= limit;
  }
  if (strtIndex < 0) strtIndex = 0;
  page = strtIndex / limit + pageBase;

  return {
    trainingSessions: trainings.slice(strtIndex, strtIndex + limit),
    currentPage: page,
    numberOfPages: Math.ceil(trainings.length / limit),
  };
};

export const trainingsHandlers = [
  rest.get("/api/trainings", function (req: any, res: any, ctx: any) {
    const search = req.url.searchParams.get("search-query");
    const pageFromReq = req.url.searchParams.get("page");
    const nrOfItems = req.url.searchParams.get("items");
    const sortDateOrder = req.url.searchParams.get("sort-date-order");
    const filterByDate = req.url.searchParams.get("filter-by-date");

    const trainings = getTrainingsWithQuery(
      search,
      pageFromReq,
      nrOfItems,
      sortDateOrder,
      filterByDate
    );

    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(trainings));
  }),
  rest.post("/api/trainings", function (req: any, res: any, ctx: any) {
    const { data, query } = req.body;

    data._id = nanoid();

    dbTrainings.push(data);

    const trainings = getTrainingsWithQuery(
      query?.search,
      query?.page,
      query?.items,
      query?.sortDateOrder,
      query?.filterByDate
    );

    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(trainings));
  }),

  rest.patch(
    "/api/trainings/update-exercises",
    function (req: any, res: any, ctx: any) {
      const { _id, exercises, query } = req.body;

      exercises.forEach((exercise: ExerciseDataFromApi) => {
        // @ts-ignore
        if (!exercise._id) exercise._id = nanoid();
        exercise.series.forEach((series: SeriesDataFromApi) => {
          // @ts-ignore
          if (!series._id) series._id = nanoid();
        });
      });

      dbTrainings = dbTrainings.map((trainig) =>
        trainig._id === _id ? { ...trainig, exercises: exercises } : trainig
      );

      const trainings = getTrainingsWithQuery(
        query?.search,
        query?.page,
        query?.items,
        query?.sortDateOrder,
        query?.filterByDate
      );

      return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(trainings));
    }
  ),
  rest.delete("/api/trainings/:_id", function (req: any, res: any, ctx: any) {
    const { _id } = req.params;
    const { query } = req.body;

    dbTrainings = dbTrainings.filter((trainig) => trainig._id !== _id);

    const trainings = getTrainingsWithQuery(
      query?.search,
      query?.page,
      query?.items,
      query?.sortDateOrder,
      query?.filterByDate
    );

    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(trainings));
  }),
];
