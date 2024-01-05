import { ComponentProps, Suspense } from "react";
import { Outlet } from "react-router-dom";
import AppBar from "../containers/AppBar";
import LoadingPage from "@/pages/misc/loading-page";

const MainLayout = ({ children }: ComponentProps<"div">) => {
  return (
    <div>
      <AppBar />

      <main>
        {children ? (
          children
        ) : (
          <Suspense fallback={<LoadingPage />}>
            <Outlet />
          </Suspense>
        )}

        <footer className="bg-primary-700 px-4 py-8 text-center">
          <p className="text-sm text-white">
            <a href="http://rul.sh/">
              Made with <span className="text-red-300">♡</span> by Khairul.
            </a>{" "}
            Artworks displayed belong to respective owners.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;
