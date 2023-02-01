import { Link, Outlet, type RouteObject } from "@/webapi/navigation";
import { lazy, Suspense } from "react";

const from = (factory: () => Promise<{ default: React.FC<{}> }>) => {
  const LazyComponent = lazy(factory);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
};
const playgroundExampleRecord: Record<string, RouteObject> = {
  "Storage Buckets API": {
    path: "webapi/storage-buckets",
    element: from(() => import("@/webapi/storage-buckets")),
  },
  "Pop-ups": {
    path: "html/pop-ups",
    element: from(() => import("@/html/pop-ups")),
  },
};

export const playgroundExamples = Object.entries(playgroundExampleRecord).map((
  [name, route],
) => ({ name, ...route }));

export const PlaygroundContainer: React.FC = () => {
  return (
    <div className="h-screen w-screen">
      <div>
        {playgroundExamples.flatMap((route, index) => {
          const link = (
            <Link key={route.name} to={`/playground/${route.path}`} replace>
              <span>{route.name}</span>
            </Link>
          );
          return index > 0 ? [<span key={`${index}`}>|</span>, link] : link;
        })}
      </div>
      <Outlet />
    </div>
  );
};
