import React, { useState } from "react";

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
      <button className="admin-button" onClick={() => void deletePost()}>
        {isDeleting ? "Deleting Post..." : "Delete Post"}
      </button>
      <button className="admin-button" onClick={onCancel}>
        Cancel
      </button>
    </>
  );
};

export interface EditPostPageProps {
  id: number;
  adminSecret: string;
  onBack: () => void;
}

const EditPostPage: React.FC<EditPostPageProps> = ({
  id,
  adminSecret,
  onBack,
}) => {
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  return isConfirmDelete ? (
    <ConfirmDeletePostPage
      id={id}
      adminSecret={adminSecret}
      onCancel={() => {
        setIsConfirmDelete(false);
      }}
      onDelete={onBack}
    />
  ) : (
    <>
      <h1 className="admin-title">Edit Post {id}</h1>
      <button className="admin-button" onClick={onBack}>
        Back
      </button>
      <button
        className="admin-button"
        onClick={() => {
          setIsConfirmDelete(true);
        }}
      >
        Delete Post
      </button>
    </>
  );
};

export default EditPostPage;
