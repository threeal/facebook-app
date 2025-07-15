import React, { useState } from "react";

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
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePost = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${id.toFixed()}`, {
        method: "DELETE",
        headers: { "admin-secret": adminSecret },
      });
      if (!res.ok) throw new Error(res.statusText);
      onBack();
    } catch (err) {
      console.error(`Failed to delete post ${id.toString()}:`, err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <h1 className="admin-title">Edit Post {id}</h1>
      <button className="admin-button" onClick={onBack}>
        Back
      </button>
      <button className="admin-button" onClick={() => void deletePost()}>
        {isDeleting ? "Deleting Post..." : "Delete Post"}
      </button>
    </>
  );
};

export default EditPostPage;
