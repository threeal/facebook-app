import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Timeline from "./timeline/Timeline";
import AdminDashboard from "./admin/AdminDashboard";
import { useAdminStore } from "./admin/adminStore";
import "./index.css";

const Root: React.FC = () => {
  const { adminSecret, isAdminDashboardVisible } = useAdminStore();
  return adminSecret && isAdminDashboardVisible ? (
    <AdminDashboard />
  ) : (
    <Timeline />
  );
};

const root = document.getElementById("root");
if (root) {
  const queryClient = new QueryClient();
  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Root />
      </QueryClientProvider>
    </StrictMode>,
  );
}
