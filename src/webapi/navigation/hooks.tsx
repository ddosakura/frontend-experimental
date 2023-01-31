import React, { createContext, useContext, useEffect, useState } from "react";

import type { NavigateEvent, Navigation } from "./navigation";
import {
  _formatPath,
  type Location,
  matchPath,
  matchRoutes,
  type Navigator,
  type PathMatch,
  type PathPattern,
  type RouteMatch,
  type RouteObject,
  type Router,
} from "./utilities";

// ===

const enum NavigationType {
  Pop = "POP",
  Push = "PUSH",
  Replace = "REPLACE",
}

const LocationContext = createContext<{
  location: Location;
  navigationType: NavigationType;
}>(null!);

export function useLocation(): Location {
  return React.useContext(LocationContext).location;
}

export function useNavigationType(): NavigationType {
  return React.useContext(LocationContext).navigationType;
}

type ParamParseKey<_P> = string;

export function useMatch<
  ParamKey extends ParamParseKey<Path>,
  Path extends string,
>(pattern: PathPattern<Path> | Path): PathMatch<ParamKey> | null {
  const { pathname } = useLocation();
  return matchPath(pattern, pathname);
}

// ===

interface RouteContextObject {
  outlet: React.ReactElement | null;
  matches: RouteMatch[];
}

const RouteContext = React.createContext<RouteContextObject>({
  outlet: null,
  matches: [],
});

export const RenderedRoute: React.FC<{
  routeContext: RouteContextObject;
  children: React.ReactNode;
}> = ({ routeContext, children }) => {
  return (
    <RouteContext.Provider value={routeContext}>
      {children}
    </RouteContext.Provider>
  );
};

// ===

const OutletContext = createContext<unknown>(null);

export function useOutlet(context?: unknown): React.ReactElement | null {
  const outlet = useContext(RouteContext).outlet;
  return outlet
    ? <OutletContext.Provider value={context}>{outlet}</OutletContext.Provider>
    : null;
}

export const Outlet: React.FC<{
  context?: unknown;
}> = ({ context }) => useOutlet(context);

// ===

const NavigationContext = createContext<{
  basename?: string;
  navigator: Navigator;
}>(null!);

export function useNavigate(): NavigateFunction {
  const { basename = "", navigator } = useContext(NavigationContext);
  const { location } = useContext(LocationContext);
  return (to: To | number, options?: { replace?: boolean }) => {
    if (typeof to === "number") return navigator.go(to);
    const pathname = to.startsWith("/")
      ? `${basename}${to}`
      : `${location.pathname.split("/").slice(0, -1).join("/")}/${to}`;
    const path = _formatPath(pathname);
    options?.replace ? navigator.replace(path) : navigator.push(path);
  };
}

type To = string;

interface NavigateFunction {
  (
    to: To,
    options?: {
      replace?: boolean;
      // state?: any;
      // relative?: RelativeRoutingType;
    },
  ): void;
  (delta: number): void;
}

export function Link({ replace, to, children }: LinkProps): React.ReactElement {
  const navigate = useNavigate();
  return (
    <a
      // rome-ignore lint/a11y/useValidAnchor: <explanation>
      onClick={(ev) => {
        ev.preventDefault();
        navigate(to, { replace });
      }}
    >
      {children}
    </a>
  );
}

interface LinkProps extends
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  > {
  replace?: boolean;
  // state?: any;
  to: To;
  // reloadDocument?: boolean;
  // preventScrollReset?: boolean;
  // relative?: "route" | "path";
}

// ===

export function useRoutes(
  routes: RouteObject[],
  // rawLocation?: Partial<Location> | string,
): React.ReactElement | null {
  const { basename } = useContext(NavigationContext);
  const location = useLocation();
  const matches = matchRoutes(
    routes,
    { pathname: location?.pathname ?? "/" },
    basename,
  );
  if (!matches) return null;
  const renderedMatches = matches.reduceRight((outlet, match, index) => {
    return (
      <RenderedRoute
        routeContext={{ outlet, matches: matches.slice(0, index + 1) }}
      >
        {match.route.element ? match.route.element : outlet}
      </RenderedRoute>
    );
  }, null as React.ReactElement | null);
  return renderedMatches;
}

const Routes: React.FC<{
  routes: RouteObject[];
}> = ({ routes }) => useRoutes(routes);

declare const navigation: Navigation;

export const RouterProvider: React.FC<{
  router: Router;
  // fallbackElement?: React.ReactNode;
}> = ({ router }) => {
  const [location, setLocation] = useState<{
    location: Location;
    navigationType: NavigationType;
  }>({
    location: router.location,
    navigationType: NavigationType.Pop,
  });
  const handler = (ev: NavigateEvent) => {
    ev.canIntercept && ev.intercept({
      handler() {
        const navigationType = ev.navigationType === "push"
          ? NavigationType.Push
          : ev.navigationType === "replace"
          ? NavigationType.Replace
          : NavigationType.Pop;
        setLocation({
          location: router.location,
          navigationType,
        });
      },
    });
  };

  useEffect(() => {
    navigation.addEventListener("navigate", handler);
    return () => navigation.removeEventListener("navigate", handler);
  }, []);

  return (
    <NavigationContext.Provider value={router}>
      <LocationContext.Provider value={location}>
        <Routes routes={router.routes} />
      </LocationContext.Provider>
    </NavigationContext.Provider>
  );
};
