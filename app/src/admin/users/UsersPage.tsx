import React, { useState } from "react";
import { useAdminUsers } from "../hooks";
import { shortenId } from "../utils";
import CreateUserPage from "./CreateUserPage";

type Page = "main" | "create";

interface UserCardsProps {
  adminSecret: string;
}

const UserCards: React.FC<UserCardsProps> = ({ adminSecret }) => {
  const users = useAdminUsers(adminSecret);

  return (
    <>
      {users.map(({ id, name, hasAvatar }) => (
        <div key={id} className="admin-card">
          ID: {shortenId(id)}
          <br />
          Name: {name}
          <br />
          {hasAvatar ? "Has Avatar" : "No Avatar"}
        </div>
      ))}
    </>
  );
};

export interface UsersPageProps {
  adminSecret: string;
  onBack: () => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ adminSecret, onBack }) => {
  const [page, setPage] = useState<Page>("main");

  switch (page) {
    case "main":
      return (
        <>
          <h1 className="admin-title">Users</h1>
          <button className="admin-button" onClick={onBack}>
            Back
          </button>
          <button
            className="admin-button"
            onClick={() => {
              setPage("create");
            }}
          >
            Create User
          </button>
          <UserCards adminSecret={adminSecret} />
        </>
      );

    case "create":
      return (
        <CreateUserPage
          adminSecret={adminSecret}
          onBack={() => {
            setPage("main");
          }}
        />
      );
  }
};

export default UsersPage;
