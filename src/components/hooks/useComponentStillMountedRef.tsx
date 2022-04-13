import { useLayoutEffect, useRef } from "react";

const useComponentStillMountedRef = () => {
  const componentStillMountedRef = useRef(true);

  useLayoutEffect(() => {
    return () => {
      console.log("TEST unmant");
      componentStillMountedRef.current = false;
    };
  }, []);

  return componentStillMountedRef;
};

export default useComponentStillMountedRef;
export type UseComponentStillMountedType = ReturnType<
  typeof useComponentStillMountedRef
>;
