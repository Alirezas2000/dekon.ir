import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import App from "./App";
import "./style.css";

// نقطه شروع برنامه React
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* مدیریت مسیرها، سازگار با GitHub Pages */}
    <HashRouter>
      {/* مدیریت اطلاعات فروشگاه، کاربران و سبد خرید */}
      <StoreProvider>
        <App />
      </StoreProvider>
    </HashRouter>
  </React.StrictMode>
);
