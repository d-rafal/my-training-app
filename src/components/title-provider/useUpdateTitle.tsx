import { useEffect } from "react";
import { useSetTitleContext } from "./TitleProvider";

const useUpdateTitle = (title: string) => {
  const setTitleContext = useSetTitleContext();

  useEffect(() => {
    setTitleContext(title);
  });

  return null;
};

export default useUpdateTitle;
