import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { parseAdminPostDetails, type AdminSubmitPostInput } from "shared";
import { SubmitPostForm } from "./SubmitPostForm";

type Page = "main" | "confirm-delete";

interface MainPageProps {
  id: number;
  adminSecret: string;
  onBack: () => void;
  onDelete: () => void;
}

const MainPage: React.FC<MainPageProps> = ({
  id,
  adminSecret,
  onBack,
  onDelete,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: post } = useQuery({
    queryKey: ["admin/posts", id, adminSecret],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id.toFixed()}`, {
          headers: { "admin-secret": adminSecret },
        });
        if (!res.ok) throw new Error(res.statusText);
        return parseAdminPostDetails(await res.json());
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        throw err;
      }
    },
    initialData: null,
  });

  const updatePost = async (post: AdminSubmitPostInput) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/posts/${id.toFixed()}`, {
        method: "PUT",
        headers: {
          "admin-secret": adminSecret,
          "content-type": "application/json",
        },
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error(res.statusText);
    } catch (err) {
      console.error("Failed to update post:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <h1 className="admin-title">Post {id}</h1>
      <button className="admin-button" disabled={isUpdating} onClick={onBack}>
        Back
      </button>
      <SubmitPostForm
        adminSecret={adminSecret}
        initialAuthorId={post?.authorId}
        initialTimestamp={post?.timestamp}
        initialCaption={post?.caption}
        initialReactions={post?.reactions}
        disabled={!post || isUpdating}
        onSubmit={(post) => void updatePost(post)}
      >
        {isUpdating ? "Updating Post..." : "Update Post"}
      </SubmitPostForm>
      <button
        className="admin-button"
        disabled={!post || isUpdating}
        onClick={onDelete}
      >
        Delete Post
      </button>
    </>
  );
};

interface ConfirmDeletePageProps {
  id: number;
  adminSecret: string;
  onCancel: () => void;
  onDelete: () => void;
}

const ConfirmDeletePage: React.FC<ConfirmDeletePageProps> = ({
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
        <MainPage
          id={id}
          adminSecret={adminSecret}
          onBack={onBack}
          onDelete={() => {
            setPage("confirm-delete");
          }}
        />
      );

    case "confirm-delete":
      return (
        <ConfirmDeletePage
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
