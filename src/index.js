import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/theme.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// Register service worker for PWA (production only)
if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const swUrl = `${process.env.PUBLIC_URL}/sw.js`;
    window.addEventListener("load", () => {
        navigator.serviceWorker.register(swUrl).catch(() => {});
    });
}
