import React, { useState } from "react";

type Page = "main" | "confirm-delete";

export interface ConfirmDeletePostPageProps {
  id: number;
  adminSecret: string;
  onCancel: () => void;
  onDelete: () => void;
}

const ConfirmDeletePostPage: React.FC<ConfirmDeletePostPageProps> = ({
  id,
  adminSecret,
  onCancel,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePost = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${id.toFixed()}`, {
        method: "DELETE",
        headers: { "admin-secret": adminSecret },
      });
      if (!res.ok) throw new Error(res.statusText);
      onDelete();
    } catch (err) {
      console.error(`Failed to delete post ${id.toString()}:`, err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <h1 className="admin-title">Confirm Delete Post {id}</h1>
      <button
        className="admin-button"
        disabled={isDeleting}
        onClick={() => void deletePost()}
      >
        {isDeleting ? "Deleting Post..." : "Delete Post"}
      </button>
      <button className="admin-button" disabled={isDeleting} onClick={onCancel}>
        Cancel
      </button>
    </>
  );
};

export interface PostDetailsPageProps {
  id: number;
  adminSecret: string;
  onBack: () => void;
}

const PostDetailsPage: React.FC<PostDetailsPageProps> = ({
  id,
  adminSecret,
  onBack,
}) => {
  const [page, setPage] = useState<Page>("main");

  switch (page) {
    case "main":
      return (
        <>
          <h1 className="admin-title">Post {id}</h1>
          <button className="admin-button" onClick={onBack}>
            Back
          </button>
          <button
            className="admin-button"
            onClick={() => {
              setPage("confirm-delete");
            }}
          >
            Delete Post
          </button>
        </>
      );

    case "confirm-delete":
      return (
        <ConfirmDeletePostPage
          id={id}
          adminSecret={adminSecret}
          onCancel={() => {
            setPage("main");
          }}
          onDelete={onBack}
        />
      );
  }
};

export default PostDetailsPage;
