import React, { useState } from "react";
import { useAdminUsers } from "../hooks";
import { shortenId } from "../utils";
import CreateUserPage from "./CreateUserPage";
import UserDetailsPage from "./UserDetailsPage";

interface UserCardsProps {
  adminSecret: string;
  onUserClick: (id: string) => void;
}

const UserCards: React.FC<UserCardsProps> = ({ adminSecret, onUserClick }) => {
  const users = useAdminUsers(adminSecret);

  return (
    <>
      {users.map(({ id, name, hasAvatar }) => (
        <div
          key={id}
          className="admin-card"
          onClick={() => {
            onUserClick(id);
          }}
        >
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
  const [page, setPage] = useState("main");

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
          <UserCards
            adminSecret={adminSecret}
            onUserClick={(id) => {
              setPage(id);
            }}
          />
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

    default:
      return (
        <UserDetailsPage
          id={page}
          adminSecret={adminSecret}
          onBack={() => {
            setPage("main");
          }}
        />
      );
  }
};

export default UsersPage;
