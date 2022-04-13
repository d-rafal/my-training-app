/**
 * This function returns an array with all matches in str specified by passed search param. This function is a pure function.
 *
 * @param str - a string to be searched
 * @param search - a RegExp object (with or without a "g" flag, function always returns all matches) or a string
 * @returns the array with all matches, an empty array if there is no match
 */
const ownMatchAll = (str: string, search: RegExp | string) => {
  let matches: RegExpExecArray[] = [];
  let match = null;

  const regExp = new RegExp(search, "g");

  while ((match = regExp.exec(str)) !== null) {
    matches.push(match);
  }

  return matches;
};

export default ownMatchAll;
