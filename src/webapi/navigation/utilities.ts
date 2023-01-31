export interface Location {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}

export interface RouteObject {
  path?: string;
  element?: React.ReactNode;
  children?: RouteObject[];
}

export interface Navigator {
  go(delta: number): void;
  push(path: string): void;
  replace(path: string): void;
}

export interface Router {
  routes: RouteObject[];
  basename?: string;
  readonly location: Location;
  navigator: Navigator;
}

export const _formatPath = (p: string) =>
  `/${p.split("/").filter(Boolean).join("/")}`;

export function matchPath<ParamKey extends string = string>(
  rawPattern: PathPattern | string,
  pathname: string,
): PathMatch<ParamKey> | null {
  const pattern =
    typeof rawPattern === "string" ? { path: rawPattern } : rawPattern;
  const path = _formatPath(pattern.path);
  if (_formatPath(pathname).startsWith(path)) {
    return {
      params: {} as Params<ParamKey>,
      pathname,
      pattern,
    };
  }
  return null;
}

type Params<K extends string> = Record<K, string>;

export interface PathMatch<ParamKey extends string = string> {
  params: Params<ParamKey>;
  pathname: string;
  pattern: PathPattern;
}

export interface PathPattern<Path extends string = string> {
  path: Path;
  // caseSensitive?: boolean;
  // end?: boolean;
}

export function matchRoutes(
  routes: RouteObject[],
  rawLocation: Partial<Location> | string,
  basename = "/",
): RouteMatch[] | null {
  const location: Partial<Location> =
    typeof rawLocation === "string" ? { pathname: rawLocation } : rawLocation;
  if (!location.pathname?.startsWith(basename)) return null;
  const pathname = location.pathname?.replace(basename, "") ?? "/";

  const route = routes.find((route) => matchPath(route.path ?? "", pathname));
  // console.log("matchPath", { routes, location, pathname, route, basename });
  if (!route) return null;
  const match = {
    params: {},
    pathname,
    route,
  };
  if (!route.children) return [match];
  const matches = matchRoutes(
    route.children,
    location,
    _formatPath(`${basename}/${route.path}`),
  );
  return matches ? [match, ...matches] : [match];
}

export interface RouteMatch<ParamKey extends string = string> {
  params: Params<ParamKey>;
  pathname: string;
  route: RouteObject;
}
