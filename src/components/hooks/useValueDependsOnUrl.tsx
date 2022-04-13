import { useLayoutEffect, useState } from "react";

/**
 * hook allows to use a useState, and updates its value when its different then a value in a url
 *
 * @param valueInUrl: value written from url
 * @returns the same as useState
 */
const useValueDependsOnUrl = <I,>(valueInUrl: I) => {
  const [value, setValue] = useState(() => valueInUrl);

  // updating values when url manually changed
  useLayoutEffect(() => {
    if (value !== valueInUrl) {
      setValue(valueInUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueInUrl]);

  return [value, setValue] as const;
};

export default useValueDependsOnUrl;
