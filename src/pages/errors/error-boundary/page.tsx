import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import NotFoundPage from "../not-found/page";
import PageMetadata from "@/components/containers/PageMetadata";

const ErrorBoundaryPage = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundPage />;
    }
  }

  return (
    <>
      <PageMetadata title="400 Bad Request" allowIndex={false} />

      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-medium">400 Bad Request.</h1>
        <p className="mt-4">I think something is wrong here UwU</p>
      </div>
    </>
  );
};

export default ErrorBoundaryPage;
