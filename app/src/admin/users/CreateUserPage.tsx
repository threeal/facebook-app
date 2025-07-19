import React, { useState } from "react";
import { parseAdminCreatetResult } from "shared";
import { useParseAdminSubmitUser } from "../hooks";
import ActionButton from "../inputs/ActionButton";
import FileInput from "../inputs/FileInput";
import TextInput from "../inputs/TextInput";

export interface CreateUserPageProps {
  adminSecret: string;
  onBack: () => void;
}

const CreateUserPage: React.FC<CreateUserPageProps> = ({
  adminSecret,
  onBack,
}) => {
  const { user, setName } = useParseAdminSubmitUser();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  return (
    <>
      <h1 className="admin-title">Create User</h1>
      <button className="admin-button" onClick={onBack}>
        Back
      </button>
      <TextInput
        label="Name"
        onTextChanged={(text) => {
          setName(text);
        }}
      />
      <FileInput
        label="Avatar"
        accept="image/*"
        onFileChanged={(file) => {
          setAvatarFile(file);
        }}
      />
      <ActionButton
        label="Create User"
        processingLabel="Creating User..."
        errorLabel="Failed to Create User"
        disabled={!user}
        onAction={async () => {
          const res = await fetch("/api/admin/users", {
            method: "POST",
            headers: {
              "admin-secret": adminSecret,
              "content-type": "application/json",
            },
            body: JSON.stringify(user),
          });
          if (!res.ok) throw new Error(res.statusText);
          const { id } = parseAdminCreatetResult(await res.json());

          if (avatarFile) {
            const formData = new FormData();
            formData.append("file", avatarFile);

            const res = await fetch(`/api/admin/users/${id}/avatar`, {
              method: "POST",
              headers: { "admin-secret": adminSecret },
              body: formData,
            });
            if (!res.ok) throw new Error(res.statusText);
          }

          onBack();
        }}
      />
    </>
  );
};

export default CreateUserPage;
