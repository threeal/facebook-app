import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Timeline from "../timeline/Timeline";
import "./AdminDashboard.css";

export interface AdminDashboardProps {
  adminSecret: string;
  onAdminSecretInvalid: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminSecret,
  onAdminSecretInvalid,
}) => {
  const { data: isSecretVerified } = useQuery({
    queryKey: ["admin/verify", adminSecret],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "admin-secret": adminSecret },
          body: null,
        });
        if (!res.ok) throw new Error(res.statusText);
        return true;
      } catch (err) {
        console.error("Failed to verify admin:", err);
        onAdminSecretInvalid();
        return false;
      }
    },
    initialData: false,
  });

  const [showDashboard, setShowDashboard] = useState<boolean>(true);

  if (!isSecretVerified) return null;

  const openDashboard = () => {
    setShowDashboard(true);
  };

  const closeDashboard = () => {
    setShowDashboard(false);
  };

  const exitDashboard = () => {
    onAdminSecretInvalid();
    window.history.replaceState({}, "", window.location.pathname);
  };

  return showDashboard ? (
    <>
      <h1 className="admin-title">Admin Dashboard</h1>
      <button className="admin-button" onClick={closeDashboard}>
        Timeline
      </button>
      <button className="admin-button" onClick={exitDashboard}>
        Exit
      </button>
    </>
  ) : (
    <>
      <h1 className="admin-title">Timeline</h1>
      <button className="admin-button" onClick={openDashboard}>
        Admin Dashboard
      </button>
      <Timeline />
    </>
  );
};

export default AdminDashboard;
