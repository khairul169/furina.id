import { lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import ErrorBoundaryPage from "./pages/errors/error-boundary/page";

const HomePage = lazy(() => import("./pages/home/page"));
const MyFurinaPage = lazy(() => import("./pages/my-furina/page"));

const router = createBrowserRouter([
  {
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "/toodle", Component: MyFurinaPage },
    ],
    ErrorBoundary: () => (
      <MainLayout>
        <ErrorBoundaryPage />
      </MainLayout>
    ),
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
