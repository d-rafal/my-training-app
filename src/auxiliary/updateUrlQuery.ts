/**
 * This function updates a query key on a given search portion of the URL, and returns a new instance of that search portion.
 * The function performs also a normalization of the given query by adding missing leading "?" or returning an empty string instead of "?".
 * If param queryKey is equal to an empty string, the query key is removed in a returned value.
 * If any of parameters is not a primitive string type, the function throws new Error() with the appropriate message.
 *
 * @param originalQuery - the original search portion of the URL.
 * @param queryKey - the name of a query key to be updated.
 * @param newKeyValue - the new value for a query key. If an empty string, the query key is removed in a returned value
 * @returns a new instance of a given query, with an updated query key and added leading "?" if not exists in an original query. If there is no any query, returns an empty string.
 */
const updateUrlQuery = (
  originalQuery: string,
  queryKey: string,
  newKeyValue?: string
) => {
  if (typeof originalQuery !== "string")
    throw new Error(
      "typeof param 'originalQuery' in 'updateUrlQuery' function different than 'string'"
    );

  if (typeof queryKey !== "string")
    throw new Error(
      "typeof param 'queryKey' in 'updateUrlQuery' function different than 'string'"
    );

  if (newKeyValue && typeof newKeyValue !== "string")
    throw new Error(
      "typeof param 'newKeyValue' in 'updateUrlQuery' function different than 'string'"
    );

  let searchUrl = "";

  if (!queryKey) {
    searchUrl = originalQuery;
  } else {
    if (newKeyValue) {
      const queryRegExpGlobalFlag = new RegExp(`${queryKey}=[^&]*`, "g");

      if (originalQuery.match(queryRegExpGlobalFlag) !== null) {
        const queryRegExpWithGroup = new RegExp(`(${queryKey}=)[^&]*`, "g");
        searchUrl = originalQuery.replace(
          queryRegExpWithGroup,
          `$1${newKeyValue}`
        );
      } else {
        if (originalQuery === "" || originalQuery === "?") {
          searchUrl = `?${queryKey}=${newKeyValue}`;
        } else searchUrl = originalQuery + `&${queryKey}=${newKeyValue}`;
      }
    } else {
      const queryRegExpToDelete = new RegExp(
        `(&|\\?)?${queryKey}=[^&]*(&?)`,
        "g"
      );
      searchUrl = originalQuery.replace(
        queryRegExpToDelete,
        (match, p1, p2) => {
          if ((p1 === "?" || p1 === "" || p1 === undefined) && p2 === "&") {
            return "?";
          } else if (p1 === "&" && p2 === "&") {
            return "&";
          } else {
            return "";
          }
        }
      );
    }
  }

  if (searchUrl.length) {
    if (searchUrl === "?") {
      searchUrl = "";
    } else if (searchUrl[0] !== "?") {
      searchUrl = "?" + searchUrl;
    }
  }

  return searchUrl;
};

export default updateUrlQuery;
