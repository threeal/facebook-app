import { getErrorMessage } from "catched-error-message";
import React, { useState } from "react";
import { parseAdminCreatetPostResult } from "shared";
import { useParseAdminSubmitPost } from "../hooks";
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
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const { post, setAuthorId, setTimestamp, setCaption, setReactions } =
    useParseAdminSubmitPost();

  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const createPost = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "admin-secret": adminSecret,
          "content-type": "application/json",
        },
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error(res.statusText);
      const { id } = parseAdminCreatetPostResult(await res.json());

      if (mediaFile) {
        const formData = new FormData();
        formData.append("file", mediaFile);

        const res = await fetch(`/api/admin/posts/${id.toFixed()}/media`, {
          method: "POST",
          headers: { "admin-secret": adminSecret },
          body: formData,
        });
        if (!res.ok) throw new Error(res.statusText);
      }

      onBack();
    } catch (err) {
      console.error("Failed to create post:", err);
      setError(err);
    } finally {
      setIsCreating(false);
    }
  };

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
        accept="image/*"
        onFileChanged={(file) => {
          setMediaFile(file);
        }}
      />
      <button
        className="admin-button"
        disabled={isCreating || !post}
        onClick={() => {
          void createPost();
        }}
      >
        {isCreating
          ? "Creating Post..."
          : error
            ? "Failed to Create Post"
            : "Create Post"}
      </button>
      {error && (
        <label className="admin-input-label">
          Error: {getErrorMessage(error)}
        </label>
      )}
    </>
  );
};

export default CreatePostPage;
