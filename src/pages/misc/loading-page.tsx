import loadingIllust from "@/assets/images/l9fsdoa2j7vb1.gif";

const LoadingPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-slate-900 text-white">
      <img src={loadingIllust} className="h-24 animate-bounce rounded-full" />
      <p className="mt-2">Please wait a moment...</p>
    </div>
  );
};

export default LoadingPage;
