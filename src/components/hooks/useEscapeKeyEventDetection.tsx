import { useCallback } from "react";

const useEscapeKeyEventDetection = <T,>(
  callbackIfTrue: () => void
): ((e: React.KeyboardEvent<T>) => void) => {
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<any>) => {
      if (e.key === "Escape") callbackIfTrue();
    },
    [callbackIfTrue]
  );

  return onKeyDown;
};

export default useEscapeKeyEventDetection;
