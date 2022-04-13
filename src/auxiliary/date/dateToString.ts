export const dateToString = (date: Date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  const yearString = String(year);

  let monthString = String(month);

  if (monthString.length < 2) {
    monthString = "0" + monthString;
  }

  let dayString = String(day);

  if (dayString.length < 2) {
    dayString = "0" + dayString;
  }

  return `${yearString}-${monthString}-${dayString}`;
};
