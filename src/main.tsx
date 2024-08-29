import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import Providers from "./providers.tsx";
import "./main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
