import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { AppReduxDispatch, RootState } from "../store";

export const useAppDispatch = () => useDispatch<AppReduxDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
