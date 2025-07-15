import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Timeline from "./timeline/Timeline";
import AdminDashboard from "./admin/AdminDashboard";
import "./index.css";

const Root: React.FC = () => {
  const [adminSecret, setAdminSecret] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("admin-secret") ?? localStorage.getItem("adminSecret");
  });

  const [isAdminModeEnabled, setIsAdminModeEnabled] = useState(false);
  const [isAdminDashboardVisible, setIsAdminDashboardVisible] = useState(false);

  const disableAdminMode = () => {
    localStorage.removeItem("adminSecret");
    setAdminSecret(null);
    setIsAdminModeEnabled(false);
    setIsAdminDashboardVisible(false);
    window.history.replaceState({}, "", window.location.pathname);
  };

  useEffect(() => {
    if (adminSecret) {
      const verifyAdminSecret = async () => {
        try {
          const res = await fetch("/api/admin/verify", {
            method: "POST",
            headers: { "admin-secret": adminSecret },
            body: null,
          });
          if (!res.ok) throw new Error(res.statusText);
          localStorage.setItem("adminSecret", adminSecret);
          setIsAdminModeEnabled(true);
        } catch (err) {
          console.error("Failed to verify admin:", err);
          disableAdminMode();
        }
      };
      void verifyAdminSecret();
    }
  }, [adminSecret]);

  return adminSecret && isAdminModeEnabled && isAdminDashboardVisible ? (
    <AdminDashboard
      adminSecret={adminSecret}
      onTimelineSwitch={() => {
        setIsAdminDashboardVisible(false);
      }}
      onExit={disableAdminMode}
    />
  ) : (
    <Timeline
      isAdminModeEnabled={isAdminModeEnabled}
      onAdminDashboardSwitch={() => {
        setIsAdminDashboardVisible(true);
      }}
    />
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
