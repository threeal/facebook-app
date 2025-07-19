import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { parseAdminUserDetails } from "shared";
import ActionButton from "../inputs/ActionButton";
import FileInput from "../inputs/FileInput";
import TextInput from "../inputs/TextInput";
import { useParseAdminSubmitUser } from "../hooks";
import { shortenId } from "../utils";

type Page =
  | "main"
  | "confirm-delete"
  | "create-avatar"
  | "confirm-avatar-delete";

interface UpdateUserFormProps {
  id: string;
  adminSecret: string;
  onCreateAvatar: () => void;
  onDeleteAvatar: () => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({
  id,
  adminSecret,
  onCreateAvatar,
  onDeleteAvatar,
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
      {userDetails &&
        (userDetails.hasAvatar ? (
          <>
            <label className="admin-input-label">Avatar</label>
            <div className="admin-avatar">
              <img src={`/static/users/avatars/${id}/40x40.webp`} />
            </div>
            <button className="admin-button" onClick={onDeleteAvatar}>
              Delete User Avatar
            </button>
          </>
        ) : (
          <button className="admin-button" onClick={onCreateAvatar}>
            Create User Avatar
          </button>
        ))}
    </>
  );
};

interface CreateUserAvatarFormProps {
  id: string;
  adminSecret: string;
  onCreated: () => void;
}

const CreateUserAvatarForm: React.FC<CreateUserAvatarFormProps> = ({
  id,
  adminSecret,
  onCreated,
}) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  return (
    <>
      <FileInput
        label="Avatar"
        accept="image/*"
        onFileChanged={(file) => {
          setAvatarFile(file);
        }}
      />
      <ActionButton
        label="Create Usert Avatar"
        processingLabel="Creating User Avatar..."
        errorLabel="Failed to Create User Avatar"
        disabled={!avatarFile}
        onAction={async () => {
          if (avatarFile) {
            const formData = new FormData();
            formData.append("file", avatarFile);

            const res = await fetch(`/api/admin/users/${id}/avatar`, {
              method: "POST",
              headers: { "admin-secret": adminSecret },
              body: formData,
            });
            if (!res.ok) throw new Error(res.statusText);

            onCreated();
          }
        }}
      />
    </>
  );
};

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
  const [page, setPage] = useState<Page>("main");

  switch (page) {
    case "main":
      return (
        <>
          <h1 className="admin-title">User {shortenId(id)}</h1>
          <button className="admin-button" onClick={onBack}>
            Back
          </button>
          <UpdateUserForm
            id={id}
            adminSecret={adminSecret}
            onCreateAvatar={() => {
              setPage("create-avatar");
            }}
            onDeleteAvatar={() => {
              setPage("confirm-avatar-delete");
            }}
          />
          <button
            className="admin-button"
            onClick={() => {
              setPage("confirm-delete");
            }}
          >
            Delete User
          </button>
        </>
      );

    case "confirm-delete":
      return (
        <>
          <h1 className="admin-title">Confirm Delete User {shortenId(id)}</h1>
          <ActionButton
            label="Delete User"
            processingLabel="Deleting User..."
            errorLabel="Failed to Delete User"
            onAction={async () => {
              const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
                headers: { "admin-secret": adminSecret },
              });
              if (!res.ok) throw new Error(res.statusText);
              onBack();
            }}
          />
          <button
            className="admin-button"
            onClick={() => {
              setPage("main");
            }}
          >
            Cancel
          </button>
        </>
      );

    case "create-avatar":
      return (
        <>
          <h1 className="admin-title">Create User {shortenId(id)} Avatar</h1>
          <button
            className="admin-button"
            onClick={() => {
              setPage("main");
            }}
          >
            Back
          </button>
          <CreateUserAvatarForm
            id={id}
            adminSecret={adminSecret}
            onCreated={() => {
              setPage("main");
            }}
          />
        </>
      );

    case "confirm-avatar-delete":
      return (
        <>
          <h1 className="admin-title">
            Confirm Delete User {shortenId(id)} Avatar
          </h1>
          <ActionButton
            label="Delete User Avatar"
            processingLabel="Deleting User Avatar..."
            errorLabel="Failed to Delete User Avatar"
            onAction={async () => {
              const res = await fetch(`/api/admin/users/${id}/avatar`, {
                method: "DELETE",
                headers: { "admin-secret": adminSecret },
              });
              if (!res.ok) throw new Error(res.statusText);
              setPage("main");
            }}
          />
          <button
            className="admin-button"
            onClick={() => {
              setPage("main");
            }}
          >
            Cancel
          </button>
        </>
      );
  }
};

export default UserDetailsPage;
