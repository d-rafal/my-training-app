import * as React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

const NavbarLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<NavLinkProps, "style" | "className">
>((NavLinkProps, ref) => {
  return (
    <NavLink
      ref={ref}
      style={({ isActive }: { isActive: boolean }) => ({})}
      {...NavLinkProps}
    />
  );
});

export default React.memo(NavbarLink);
