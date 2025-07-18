import React from "react";
import { useAdminUsers } from "../hooks";
import { shortenId } from "../utils";

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
  return (
    <>
      <h1 className="admin-title">Users</h1>
      <button className="admin-button" onClick={onBack}>
        Back
      </button>
      <UserCards adminSecret={adminSecret} />
    </>
  );
};

export default UsersPage;
