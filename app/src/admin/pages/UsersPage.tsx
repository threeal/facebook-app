import React from "react";
import { useAdminUsers } from "../hooks";

export interface UsersPageProps {
  adminSecret: string;
  onBack: () => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ adminSecret, onBack }) => {
  const users = useAdminUsers(adminSecret);

  return (
    <>
      <h1 className="admin-title">Users</h1>
      <button className="admin-button" onClick={onBack}>
        Back
      </button>
      {users.map(({ id, name, hasAvatar }) => (
        <div key={id} className="admin-card">
          ID: {id}
          <br />
          Name: {name}
          <br />
          {hasAvatar ? "Has Avatar" : "No Avatar"}
        </div>
      ))}
    </>
  );
};

export default UsersPage;
