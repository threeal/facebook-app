import { useQuery } from "@tanstack/react-query";
import React from "react";
import { parseRawUsersSchema } from "shared";
import { useAdminStore } from "../adminStore";

export interface UsersPageProps {
  onBack: () => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ onBack }) => {
  const { adminSecret } = useAdminStore();
  const { data: users } = useQuery({
    queryKey: ["admin/users", adminSecret],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/users", {
          headers: { "admin-secret": adminSecret ?? "" },
        });
        if (!res.ok) throw new Error(res.statusText);
        return parseRawUsersSchema(await res.json());
      } catch (err) {
        console.error("Failed to fetch users:", err);
        throw err;
      }
    },
    initialData: [],
  });

  return (
    <>
      <h1 className="admin-title">Users</h1>
      <button className="admin-button" onClick={onBack}>
        Back
      </button>
      {users.map(({ id, name, avatar }) => (
        <div key={id} className="admin-card">
          ID: {id}
          <br />
          Name: {name}
          <br />
          Avatar: {avatar}
        </div>
      ))}
    </>
  );
};

export default UsersPage;
