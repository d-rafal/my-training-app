import { createContext, useState } from "react";
import createCtx from "../auxiliary/createCtx";

const OpenDrawerContext = createContext<boolean>(false);

const [useDrawerSetOpen, DrawerSetOpenContextProvider] = createCtx<
  React.Dispatch<React.SetStateAction<boolean>>
>("DrawerSetOpenContextProvider");

const LeftSideDrawerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <OpenDrawerContext.Provider value={drawerOpen}>
      <DrawerSetOpenContextProvider value={setDrawerOpen}>
        {children}
      </DrawerSetOpenContextProvider>
    </OpenDrawerContext.Provider>
  );
};

export default LeftSideDrawerProvider;

export { useDrawerSetOpen, OpenDrawerContext };
