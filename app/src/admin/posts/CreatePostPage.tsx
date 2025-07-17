import React, { useMemo, useState } from "react";
import { parseAdminSubmitPost, type AdminSubmitPostInput } from "shared";
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
  const [authorId, setAuthorId] = useState(-1);
  const [timestamp, setTimestamp] = useState(-1);
  const [caption, setCaption] = useState("");
  const [reactions, setReactions] = useState(0);

  const post = useMemo(() => {
    try {
      const input: AdminSubmitPostInput = {
        authorId,
        timestamp,
        caption,
        reactions,
      };
      return parseAdminSubmitPost(input);
    } catch {
      return null;
    }
  }, [authorId, timestamp, caption, reactions]);

  const createPost = async (post: AdminSubmitPostInput) => {
    setIsCreating(true);
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
      onBack();
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <h1 className="admin-title">Create Post</h1>
      <button className="admin-button" disabled={isCreating} onClick={onBack}>
        Back
      </button>
      <UserSelectInput
        adminSecret={adminSecret}
        label="Author"
        disabled={isCreating}
        onUserSelected={(userId) => {
          setAuthorId(userId);
        }}
      />
      <TimestampInput
        label="Date"
        disabled={isCreating}
        onTimestampChanged={(timestamp) => {
          setTimestamp(timestamp);
        }}
      />
      <TextAreaInput
        label="Caption"
        disabled={isCreating}
        onTextChanged={(text) => {
          setCaption(text);
        }}
      />
      <NumberInput
        label="Reactions"
        disabled={isCreating}
        onValueChanged={(value) => {
          setReactions(value);
        }}
      />
      <button
        className="admin-button"
        disabled={isCreating || !post}
        onClick={() => {
          if (post) void createPost(post);
        }}
      >
        {isCreating ? "Creating Post..." : "Create Post"}
      </button>
    </>
  );
};

export default CreatePostPage;
