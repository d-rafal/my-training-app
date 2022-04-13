import updateUrlQuery from "./updateUrlQuery";

const testPatterns = [
  {
    pattern: "",
    options: [
      {
        queryKey: "query",
        newKeyValue: "new-search-query",
        returnValue: "?query=new-search-query",
      },
      {
        queryKey: "",
        newKeyValue: "new-search-query",
        returnValue: "",
      },
      {
        queryKey: "query",
        newKeyValue: "",
        returnValue: "",
      },
    ],
  },
  {
    pattern: "query=search-query",
    options: [
      {
        queryKey: "query",
        newKeyValue: "new-search-query",
        returnValue: "?query=new-search-query",
      },
      {
        queryKey: "",
        newKeyValue: "new-search-query",
        returnValue: "?query=search-query",
      },
      {
        queryKey: "query",
        newKeyValue: "",
        returnValue: "",
      },
    ],
  },
  {
    pattern: "query=search-query&page=1",
    options: [
      {
        queryKey: "query",
        newKeyValue: "new-search-query",
        returnValue: "?query=new-search-query&page=1",
      },
      {
        queryKey: "",
        newKeyValue: "new-search-query",
        returnValue: "?query=search-query&page=1",
      },
      {
        queryKey: "query",
        newKeyValue: "",
        returnValue: "?page=1",
      },
    ],
  },
  {
    pattern: "page=1&query=search-query",
    options: [
      {
        queryKey: "query",
        newKeyValue: "new-search-query",
        returnValue: "?page=1&query=new-search-query",
      },
      {
        queryKey: "",
        newKeyValue: "new-search-query",
        returnValue: "?page=1&query=search-query",
      },
      {
        queryKey: "query",
        newKeyValue: "",
        returnValue: "?page=1",
      },
    ],
  },
  {
    pattern: "page=1&query=search-query&items=16",
    options: [
      {
        queryKey: "query",
        newKeyValue: "new-search-query",
        returnValue: "?page=1&query=new-search-query&items=16",
      },
      {
        queryKey: "",
        newKeyValue: "new-search-query",
        returnValue: "?page=1&query=search-query&items=16",
      },
      {
        queryKey: "query",
        newKeyValue: "",
        returnValue: "?page=1&items=16",
      },
    ],
  },
  {
    pattern: "page=1&query=search-query&items=16",
    options: [
      {
        queryKey: "query2",
        newKeyValue: "new-search-query",
        returnValue:
          "?page=1&query=search-query&items=16&query2=new-search-query",
      },
      {
        queryKey: "",
        newKeyValue: "new-search-query",
        returnValue: "?page=1&query=search-query&items=16",
      },
      {
        queryKey: "query2",
        newKeyValue: "",
        returnValue: "?page=1&query=search-query&items=16",
      },
    ],
  },
];

testPatterns.forEach((testPattern, patternIndex) => {
  testPattern.options.forEach((option, optionIndex) => {
    test(`Pattern: ${patternIndex}, option: ${optionIndex}`, () => {
      expect(
        updateUrlQuery(testPattern.pattern, option.queryKey, option.newKeyValue)
      ).toBe(option.returnValue);
    });
    test(`?Pattern: ${patternIndex}, option: ${optionIndex}`, () => {
      expect(
        updateUrlQuery(
          "?" + testPattern.pattern,
          option.queryKey,
          option.newKeyValue
        )
      ).toBe(option.returnValue);
    });
  });
});

test("originalQuery not a string type", () => {
  expect(() => updateUrlQuery(1 as any, "")).toThrow(
    "typeof param 'originalQuery' in 'updateUrlQuery' function different than 'string'"
  );
});
test("queryKey not a string type", () => {
  expect(() => updateUrlQuery("", 1 as any)).toThrow(
    "typeof param 'queryKey' in 'updateUrlQuery' function different than 'string'"
  );
});
test("newKeyValue not a string type", () => {
  expect(() => updateUrlQuery("", "", 1 as any)).toThrow(
    "typeof param 'newKeyValue' in 'updateUrlQuery' function different than 'string'"
  );
});
