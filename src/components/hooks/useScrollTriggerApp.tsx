import { useEffect, useState } from "react";
import debounce from "../../auxiliary/debounce";

const useScrollTriggerApp = (
  threshold: number,
  scrollTarget: React.RefObject<HTMLDivElement | Window>
) => {
  const [scrolledTrigger, setScrolledTrigger] = useState(false);

  type RefObject = typeof scrollTarget extends
    | React.RefObject<infer R | Window>
    | undefined
    ? R
    : Element;

  useEffect(() => {
    const current = scrollTarget.current;

    const scrollHandler = debounce(() => {
      const actualScroll =
        (current as Window).scrollY ?? (current as RefObject).scrollTop;

      if (actualScroll > threshold) {
        setScrolledTrigger(true);
      } else {
        setScrolledTrigger(false);
      }
    }, 300);

    current?.addEventListener("scroll", scrollHandler);

    return () => {
      scrollHandler.cancel();
      current?.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollTarget, threshold]);

  return [scrolledTrigger];
};

export default useScrollTriggerApp;
