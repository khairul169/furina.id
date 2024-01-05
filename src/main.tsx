import React from "react";
import ReactDOM from "react-dom/client";
import Loader from "./Loader";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Loader />
  </React.StrictMode>
);
