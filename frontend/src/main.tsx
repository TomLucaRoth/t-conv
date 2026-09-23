import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "@/components/ui/toast"
import "@/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <ThemeProvider>
        <App />
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  </StrictMode>,
);
