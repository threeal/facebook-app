import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Timeline from "../timeline/Timeline";
import UsersPage from "./pages/UsersPage";
import "./AdminDashboard.css";

type Page = "main" | "users" | "posts";

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
  const [page, setPage] = useState<Page>("main");

  if (!isSecretVerified) return null;

  if (!showDashboard) {
    const openDashboard = () => {
      setShowDashboard(true);
    };

    return (
      <>
        <h1 className="admin-title">Timeline</h1>
        <button className="admin-button" onClick={openDashboard}>
          Admin Dashboard
        </button>
        <Timeline />
      </>
    );
  }

  const closeDashboard = () => {
    setShowDashboard(false);
  };

  const exitDashboard = () => {
    onAdminSecretInvalid();
    window.history.replaceState({}, "", window.location.pathname);
  };

  const openMainPage = () => {
    setPage("main");
  };

  const openUsersPage = () => {
    setPage("users");
  };

  const openPostsPage = () => {
    setPage("posts");
  };

  switch (page) {
    case "main":
      return (
        <>
          <h1 className="admin-title">Admin Dashboard</h1>
          <button className="admin-button" onClick={closeDashboard}>
            Timeline
          </button>
          <button className="admin-button" onClick={openUsersPage}>
            Users
          </button>
          <button className="admin-button" onClick={openPostsPage}>
            Posts
          </button>
          <button className="admin-button" onClick={exitDashboard}>
            Exit
          </button>
        </>
      );

    case "users":
      return <UsersPage adminSecret={adminSecret} onBack={openMainPage} />;

    case "posts":
      return (
        <>
          <h1 className="admin-title">Posts</h1>
          <button className="admin-button" onClick={openMainPage}>
            Back
          </button>
        </>
      );
  }
};

export default AdminDashboard;
