import {
  createHashRouter,
  Link,
  Outlet,
  RouterProvider,
  useLocation,
} from "@/webapi/navigation";

import App from "./App";

const ExampleA: React.FC = () => {
  const location = useLocation();
  return (
    <div>
      <span>Hello World!</span>
      <span>@{location.pathname}</span>
    </div>
  );
};

const ExampleB: React.FC = () => {
  return (
    <div>
      <span>Hello World! - B</span>
    </div>
  );
};

const Container: React.FC = () => {
  return (
    <div className="h-screen w-screen">
      <div>
        <Link to="example1" replace>A</Link>
        <span>|</span>
        <Link to="example2" replace>B</Link>
      </div>
      <Outlet />
    </div>
  );
};

export const router = createHashRouter([
  {
    path: "test",
    element: <Container />,
    children: [
      { path: "example1", element: <ExampleA /> },
      { path: "example2", element: <ExampleB /> },
    ],
  },
  { element: <App /> },
], { basename: "/aaa" });

export const Router = () => <RouterProvider router={router} />;
