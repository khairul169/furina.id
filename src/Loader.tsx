import React, { Suspense } from "react";
import LoadingPage from "./pages/misc/loading-page";

const App = React.lazy(() => import("./App"));

const Loader = () => (
  <Suspense fallback={<LoadingPage />}>
    <App />
  </Suspense>
);

export default Loader;
