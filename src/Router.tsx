import { lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import ErrorBoundaryPage from "./pages/errors/error-boundary/page";
import NotFoundPage from "./pages/errors/not-found/page";

const HomePage = lazy(() => import("./pages/home/page"));
const FurinaBelovedPage = lazy(() => import("./pages/furina-beloved/page"));

const router = createBrowserRouter([
  {
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "/furina-beloved", Component: FurinaBelovedPage },
      { path: "*", Component: NotFoundPage },
    ],
    ErrorBoundary: ErrorBoundaryPage,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
