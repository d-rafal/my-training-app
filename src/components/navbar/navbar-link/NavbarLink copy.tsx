import { Button } from "@mui/material";
import * as React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

interface NavbarLinkProps {
  link: string;
  text: string;
  setShowItems: (arg: boolean) => void;
  callback: VoidFunction | null;
  onKeyDown: (e: React.KeyboardEvent<HTMLAnchorElement>) => void;
}

function NavbarLink({
  link,
  text,
  setShowItems,
  callback,
  onKeyDown,
}: NavbarLinkProps) {
  const CustomNavLink = React.useMemo(
    () =>
      React.forwardRef<
        HTMLAnchorElement,
        Omit<NavLinkProps, "style" | "className">
      >((NavLinkProps, ref) => {
        return (
          <NavLink
            ref={ref}
            className={({ isActive }: { isActive: boolean }) => {
              return "null";
            }}
            style={({ isActive }: { isActive: boolean }) => ({})}
            {...NavLinkProps}
          />
        );
      }),
    []
  );

  return (
    <li>
      <Button
        component={CustomNavLink}
        end={true}
        to={link}
        onClick={() => {
          callback && callback();
          setShowItems(false);
        }}
        onKeyDown={onKeyDown}
      >
        {text}
      </Button>
    </li>
  );
}

export default React.memo(NavbarLink);
