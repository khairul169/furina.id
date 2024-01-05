import loadingIllust from "@/assets/images/l9fsdoa2j7vb1.gif";

const LoadingPage = () => {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center text-center">
      <img src={loadingIllust} className="h-40 animate-bounce" />
      <p className="mt-2">Please wait a moment...</p>
    </div>
  );
};

export default LoadingPage;
