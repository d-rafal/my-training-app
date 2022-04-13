export const isDateValid = (date: Date) =>
  date instanceof Date && !Number.isNaN(Number(date));
