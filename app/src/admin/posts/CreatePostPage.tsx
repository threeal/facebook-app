import React, { useState } from "react";
import { parseAdminCreatetResult } from "shared";
import { useParseAdminSubmitPost } from "../hooks";
import ActionButton from "../inputs/ActionButton";
import FileInput from "../inputs/FileInput";
import NumberInput from "../inputs/NumberInput";
import TextAreaInput from "../inputs/TextAreaInput";
import TimestampInput from "../inputs/TimestampInput";
import UserSelectInput from "../inputs/UserSelectInput";

export interface CreatePostPageProps {
  adminSecret: string;
  onBack: () => void;
}

const CreatePostPage: React.FC<CreatePostPageProps> = ({
  adminSecret,
  onBack,
}) => {
  const { post, setAuthorId, setTimestamp, setCaption, setReactions } =
    useParseAdminSubmitPost();

  const [mediaFile, setMediaFile] = useState<File | null>(null);

  return (
    <>
      <h1 className="admin-title">Create Post</h1>
      <button className="admin-button" onClick={onBack}>
        Back
      </button>
      <UserSelectInput
        adminSecret={adminSecret}
        label="Author"
        onUserSelected={(userId) => {
          setAuthorId(userId);
        }}
      />
      <TimestampInput
        label="Date"
        onTimestampChanged={(timestamp) => {
          setTimestamp(timestamp);
        }}
      />
      <TextAreaInput
        label="Caption"
        onTextChanged={(text) => {
          setCaption(text);
        }}
      />
      <NumberInput
        label="Reactions"
        onValueChanged={(value) => {
          setReactions(value);
        }}
      />
      <FileInput
        label="Media"
        accept="image/*,video/*"
        onFileChanged={(file) => {
          setMediaFile(file);
        }}
      />
      <ActionButton
        label="Create Post"
        processingLabel="Creating Post..."
        errorLabel="Failed to Create Post"
        disabled={!post}
        onAction={async () => {
          const res = await fetch("/api/admin/posts", {
            method: "POST",
            headers: {
              "admin-secret": adminSecret,
              "content-type": "application/json",
            },
            body: JSON.stringify(post),
          });
          if (!res.ok) throw new Error(res.statusText);
          const { id } = parseAdminCreatetResult(await res.json());

          if (mediaFile) {
            const formData = new FormData();
            formData.append("file", mediaFile);

            const res = await fetch(`/api/admin/posts/${id}/media`, {
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

export default CreatePostPage;
