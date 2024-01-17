import { lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import ErrorBoundaryPage from "./pages/errors/error-boundary/page";

const HomePage = lazy(() => import("./pages/home/page"));
const PatPatPage = lazy(() => import("./pages/pat-pat/page"));
const MyFurinaPage = lazy(() => import("./pages/my-furina/page"));
const ArtworksPage = lazy(() => import("./pages/artworks/page"));

const router = createBrowserRouter([
  {
    children: [
      { index: true, Component: HomePage },
      {
        Component: MainLayout,
        children: [
          { path: "/pat-pat", Component: PatPatPage },
          { path: "/toodle", Component: MyFurinaPage },
          {
            path: "/treasures",
            Component: ArtworksPage,
          },
          {
            path: "/treasures/:id",
            Component: ArtworksPage,
          },
        ],
        ErrorBoundary: () => (
          <MainLayout>
            <ErrorBoundaryPage />
          </MainLayout>
        ),
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
