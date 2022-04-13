import { useEffect, useRef } from "react";
import { OrNull } from "../../interfaces/generalInterf";

const useAbortControllerUnmountEffectHandle = () => {
  const abortControllerUnmountEffectHandle =
    useRef<OrNull<AbortController>>(null);

  useEffect(() => {
    return () => {
      if (abortControllerUnmountEffectHandle.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        abortControllerUnmountEffectHandle.current.abort();
    };
  }, []);

  return abortControllerUnmountEffectHandle;
};

export default useAbortControllerUnmountEffectHandle;
