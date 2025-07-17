import React, { useState } from "react";
import type { AdminSubmitPostInput } from "shared";
import { SubmitPostForm } from "./SubmitPostForm";

export interface CreatePostPageProps {
  adminSecret: string;
  onBack: () => void;
}

const CreatePostPage: React.FC<CreatePostPageProps> = ({
  adminSecret,
  onBack,
}) => {
  const [isCreating, setIsCreating] = useState(false);

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
      <SubmitPostForm
        adminSecret={adminSecret}
        disabled={isCreating}
        onSubmit={(post) => void createPost(post)}
      >
        {isCreating ? "Creating Post..." : "Create Post"}
      </SubmitPostForm>
    </>
  );
};

export default CreatePostPage;
