import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Timeline from "./timeline/Timeline";
import "./index.css";

const root = document.getElementById("root");
if (root) {
  const queryClient = new QueryClient();
  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Timeline />
      </QueryClientProvider>
    </StrictMode>,
  );
}
