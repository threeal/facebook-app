import React, { useState } from "react";
import PostsPage from "./posts/PostsPage";
import UsersPage from "./users/UsersPage";
import "./AdminDashboard.css";

type Page = "main" | "users" | "posts";

export interface AdminDashboardProps {
  adminSecret: string;
  onTimelineSwitch: () => void;
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminSecret,
  onTimelineSwitch,
  onExit,
}) => {
  const [page, setPage] = useState<Page>("main");

  switch (page) {
    case "main":
      return (
        <>
          <h1 className="admin-title">Admin Dashboard</h1>
          <button className="admin-button" onClick={onTimelineSwitch}>
            Timeline
          </button>
          <button
            className="admin-button"
            onClick={() => {
              setPage("users");
            }}
          >
            Users
          </button>
          <button
            className="admin-button"
            onClick={() => {
              setPage("posts");
            }}
          >
            Posts
          </button>
          <button className="admin-button" onClick={onExit}>
            Exit
          </button>
        </>
      );

    case "users":
      return (
        <UsersPage
          adminSecret={adminSecret}
          onBack={() => {
            setPage("main");
          }}
        />
      );

    case "posts":
      return (
        <PostsPage
          adminSecret={adminSecret}
          onBack={() => {
            setPage("main");
          }}
        />
      );
  }
};

export default AdminDashboard;
