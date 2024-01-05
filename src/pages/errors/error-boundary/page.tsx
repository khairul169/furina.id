import MainLayout from "@/components/layouts/MainLayout";

const ErrorBoundaryPage = () => {
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-medium">400 Bad Request.</h1>
        <p className="mt-4">I think something is wrong here UwU</p>
      </div>
    </MainLayout>
  );
};

export default ErrorBoundaryPage;
