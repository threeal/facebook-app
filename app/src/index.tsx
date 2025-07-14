import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Timeline from "./timeline/Timeline";
import AdminDashboard from "./admin/AdminDashboard";
import { verifyAdmin } from "./admin/utils";
import "./index.css";

const root = document.getElementById("root");
if (root) {
  const queryClient = new QueryClient();
  const isAdmin = await verifyAdmin();
  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        {isAdmin ? <AdminDashboard /> : <Timeline />}
      </QueryClientProvider>
    </StrictMode>,
  );
}
