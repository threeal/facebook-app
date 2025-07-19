import { useQuery } from "@tanstack/react-query";
import React from "react";
import { parseAdminUserDetails } from "shared";
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

  const { setName } = useParseAdminSubmitUser();

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
    </>
  );
};

export default UserDetailsPage;
