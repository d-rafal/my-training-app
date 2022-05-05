import { useLayoutEffect, useRef } from "react";

const useComponentStillMountedRef = () => {
  const componentStillMountedRef = useRef(true);

  useLayoutEffect(() => {
    componentStillMountedRef.current = true;

    return () => {
      componentStillMountedRef.current = false;
    };
  }, []);

  return componentStillMountedRef;
};

export default useComponentStillMountedRef;
export type UseComponentStillMountedType = ReturnType<
  typeof useComponentStillMountedRef
>;
