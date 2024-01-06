import PageMetadata from "@/components/containers/PageMetadata";

const NotFoundPage = () => {
  return (
    <>
      <PageMetadata title="404 Not Found" allowIndex={false} />

      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-medium">404 Page Not Found.</h1>
        <p className="mt-4">I think something is missing here UwU</p>
      </div>
    </>
  );
};

export default NotFoundPage;
