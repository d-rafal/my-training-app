import { createContext, useState } from "react";
import createCtx from "../../auxiliary/createCtx";

const TitleContext = createContext<string>("");
TitleContext.displayName = "TitleContext";

const [useSetTitleContext, SetTitleContextProvider] =
  createCtx<React.Dispatch<React.SetStateAction<string>>>("SetTitleContext");

const TitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState("");

  return (
    <TitleContext.Provider value={title}>
      <SetTitleContextProvider value={setTitle}>
        {children}
      </SetTitleContextProvider>
    </TitleContext.Provider>
  );
};

export { TitleContext, useSetTitleContext };
export default TitleProvider;
