import { useQuery } from "@tanstack/react-query";
import React from "react";
import { parseAdminUserDetails } from "shared";
import ActionButton from "../inputs/ActionButton";
import TextInput from "../inputs/TextInput";
import { useParseAdminSubmitUser } from "../hooks";
import { shortenId } from "../utils";

export interface UserDetailsPageProps {
  id: string;
  adminSecret: string;
  onBack: () => void;
}

const UserDetailsPage: React.FC<UserDetailsPageProps> = ({
  id,
  adminSecret,
  onBack,
}) => {
  const { data: userDetails } = useQuery({
    queryKey: ["admin/posts", id, adminSecret],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`, {
          headers: { "admin-secret": adminSecret },
        });
        if (!res.ok) throw new Error(res.statusText);
        return parseAdminUserDetails(await res.json());
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        throw err;
      }
    },
    initialData: null,
  });

  const { user, setName } = useParseAdminSubmitUser();

  return (
    <>
      <h1 className="admin-title">User {shortenId(id)}</h1>
      <button className="admin-button" onClick={onBack}>
        Back
      </button>
      <TextInput
        label="Name"
        disabled={!userDetails}
        initialText={userDetails?.name}
        onTextChanged={(text) => {
          setName(text);
        }}
      />
      <ActionButton
        label="Update User"
        processingLabel="Updating User..."
        errorLabel="Failed to Update User"
        disabled={!userDetails || !user}
        onAction={async () => {
          const res = await fetch(`/api/admin/users/${id}`, {
            method: "PUT",
            headers: {
              "admin-secret": adminSecret,
              "content-type": "application/json",
            },
            body: JSON.stringify(user),
          });
          if (!res.ok) throw new Error(res.statusText);
        }}
      />
    </>
  );
};

export default UserDetailsPage;
