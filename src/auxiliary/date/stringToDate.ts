export const stringToDate = (dateString: string) => {
  const dateFragments = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);

  return new Date(
    Number(dateFragments?.[1]),
    Number(dateFragments?.[2]) - 1,
    Number(dateFragments?.[3])
  );
};
