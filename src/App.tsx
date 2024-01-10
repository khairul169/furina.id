import { ToastContainer } from "react-toastify";
import Router from "./Router";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";

const App = () => {
  const [queryClient] = useState(new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
      <ToastContainer />
    </>
  );
};

export default App;
