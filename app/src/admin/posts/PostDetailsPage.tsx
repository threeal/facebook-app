import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "catched-error-message";
import React, { useState } from "react";
import { parseAdminPostDetails } from "shared";
import { useParseAdminSubmitPost } from "../hooks";
import NumberInput from "../inputs/NumberInput";
import TextAreaInput from "../inputs/TextAreaInput";
import TimestampInput from "../inputs/TimestampInput";
import UserSelectInput from "../inputs/UserSelectInput";

type Page = "main" | "confirm-delete";

interface MediaFormProps {
  id: number;
  mediaType: "image" | "video" | null;
}

const MediaForm: React.FC<MediaFormProps> = ({ id, mediaType }) => {
  switch (mediaType) {
    case "image":
      return (
        <div className="admin-media">
          <img src={`/static/posts/medias/${id.toFixed()}/390.webp`} />
        </div>
      );

    case "video":
      return (
        <div className="admin-media">
          <video
            src={`/static/posts/medias/${id.toString()}/390.webm`}
            controls={true}
          />
        </div>
      );
  }

  return null;
};

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
  const [error, setError] = useState<unknown>(null);

  const { data: postDetails } = useQuery({
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

  const { post, setAuthorId, setTimestamp, setCaption, setReactions } =
    useParseAdminSubmitPost();

  const updatePost = async () => {
    setIsUpdating(true);
    setError(null);
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
      setError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <h1 className="admin-title">Post {id}</h1>
      <button className="admin-button" onClick={onBack}>
        Back
      </button>
      <UserSelectInput
        adminSecret={adminSecret}
        label="Author"
        disabled={!postDetails}
        initialUserId={postDetails?.authorId}
        onUserSelected={(userId) => {
          setAuthorId(userId);
        }}
      />
      <TimestampInput
        label="Date"
        disabled={!postDetails}
        initialTimestamp={postDetails?.timestamp}
        onTimestampChanged={(timestamp) => {
          setTimestamp(timestamp);
        }}
      />
      <TextAreaInput
        label="Caption"
        disabled={!postDetails}
        initialText={postDetails?.caption}
        onTextChanged={(text) => {
          setCaption(text);
        }}
      />
      <NumberInput
        label="Reactions"
        disabled={!postDetails}
        initialValue={postDetails?.reactions}
        onValueChanged={(value) => {
          setReactions(value);
        }}
      />
      <button
        className="admin-button"
        disabled={!postDetails || !post || isUpdating}
        onClick={() => {
          void updatePost();
        }}
      >
        {isUpdating
          ? "Updating Post..."
          : error
            ? "Failed to Update Post"
            : "Update Post"}
      </button>
      {error && (
        <label className="admin-input-label">
          Error: {getErrorMessage(error)}
        </label>
      )}
      {postDetails && (
        <MediaForm id={postDetails.id} mediaType={postDetails.mediaType} />
      )}
      <button
        className="admin-button"
        disabled={!postDetails}
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
  const [error, setError] = useState<unknown>(null);

  const deletePost = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/posts/${id.toFixed()}`, {
        method: "DELETE",
        headers: { "admin-secret": adminSecret },
      });
      if (!res.ok) throw new Error(res.statusText);
      onDelete();
    } catch (err) {
      console.error(`Failed to delete post ${id.toString()}:`, err);
      setError(err);
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
        {isDeleting
          ? "Deleting Post..."
          : error
            ? "Failed to Delete Post"
            : "Delete Post"}
      </button>
      {error && (
        <label className="admin-input-label">
          Error: {getErrorMessage(error)}
        </label>
      )}
      <button className="admin-button" onClick={onCancel}>
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
