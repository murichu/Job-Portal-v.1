import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";

// Render the application to the root element
createRoot(document.getElementById("root")).render(
  // Wrap the app with ClerkProvider for authentication and BrowserRouter for routing

  <BrowserRouter>
    {/* Wrap with AppContextProvider to provide context throughout the app */}
    <AppContextProvider>
      {/* The main application component */}
      <App />
    </AppContextProvider>
  </BrowserRouter>
);
