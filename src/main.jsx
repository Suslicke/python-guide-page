import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initAnalytics } from "./analytics.js";

// Apply the saved theme BEFORE React renders — prevents a flash of the
// wrong theme. Default is dark unless the user previously picked light.
(() => {
  try {
    const saved = localStorage.getItem("theme");
    const theme = saved === "light" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {
    document.documentElement.classList.add("dark");
  }
})();

initAnalytics();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
