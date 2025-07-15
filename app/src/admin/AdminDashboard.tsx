import React, { useState } from "react";
import PostsPage from "./pages/PostsPage";
import UsersPage from "./pages/UsersPage";
import "./AdminDashboard.css";
import { useAdminStore } from "./adminStore";

type Page = "main" | "users" | "posts";

const AdminDashboard: React.FC = () => {
  const { clearAdminSecret, hideAdminDashboard } = useAdminStore();
  const [page, setPage] = useState<Page>("main");

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
          <button className="admin-button" onClick={hideAdminDashboard}>
            Timeline
          </button>
          <button className="admin-button" onClick={openUsersPage}>
            Users
          </button>
          <button className="admin-button" onClick={openPostsPage}>
            Posts
          </button>
          <button className="admin-button" onClick={clearAdminSecret}>
            Exit
          </button>
        </>
      );

    case "users":
      return <UsersPage onBack={openMainPage} />;

    case "posts":
      return <PostsPage onBack={openMainPage} />;
  }
};

export default AdminDashboard;
