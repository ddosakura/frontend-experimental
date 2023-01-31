import type { Location, RouteObject, Router } from "./utilities";

export const createHashRouter = (
  routes: RouteObject[],
  opts?: { basename?: string },
): Router => {
  return {
    routes,
    basename: opts?.basename,
    get location(): Location {
      const url = new URL(
        document.location.hash.replace("#", ""),
        document.location.origin,
      );
      // console.log("get location", url);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        state: null,
        key: "default",
      };
    },
    navigator: {
      go(delta: number) {
        history.go(delta);
      },
      push(path: string) {
        const url = new URL(location.href);
        url.hash = `#${path}`;
        history.pushState(null, "", url);
      },
      replace(path: string) {
        const url = new URL(location.href);
        url.hash = `#${path}`;
        history.replaceState(null, "", url);
      },
    },
  };
};
