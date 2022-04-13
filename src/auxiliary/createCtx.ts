import * as React from "react";

function createCtx<A>(displayName: string) {
  const ctx = React.createContext<A | null>(null);
  ctx.displayName = displayName;
  function useCtx(): A | never {
    const c = React.useContext(ctx);
    if (!c) throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const;
}

export default createCtx;
