import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import Timeline from "./timeline/Timeline";
import AdminDashboard from "./admin/AdminDashboard";
import "./index.css";

const Root: React.FC = () => {
  const [adminSecret, setAdminSecret] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const adminSecret = params.get("admin-secret");
    if (adminSecret) {
      localStorage.setItem("adminSecret", adminSecret);
      return adminSecret;
    } else {
      return localStorage.getItem("adminSecret");
    }
  });

  const resetAdminSecret = () => {
    setAdminSecret(null);
    localStorage.removeItem("adminSecret");
  };

  return adminSecret ? (
    <AdminDashboard
      adminSecret={adminSecret}
      onAdminSecretInvalid={resetAdminSecret}
    />
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
