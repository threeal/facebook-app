import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { parseAdminPostDetails } from "shared";
import { useParseAdminSubmitPost } from "../hooks";
import ActionButton from "../inputs/ActionButton";
import FileInput from "../inputs/FileInput";
import NumberInput from "../inputs/NumberInput";
import TextAreaInput from "../inputs/TextAreaInput";
import TimestampInput from "../inputs/TimestampInput";
import UserSelectInput from "../inputs/UserSelectInput";

type Page = "main" | "confirm-delete" | "create-media" | "confirm-media-delete";

interface MediaFormProps {
  id: string;
  mediaType: "image" | "video" | null;
  onCreate: () => void;
  onDelete: () => void;
}

const MediaForm: React.FC<MediaFormProps> = ({
  id,
  mediaType,
  onCreate,
  onDelete,
}) => {
  switch (mediaType) {
    case "image":
      return (
        <>
          <label className="admin-input-label">Media</label>
          <div className="admin-media">
            <img src={`/static/posts/medias/${id}/390.webp`} />
          </div>
          <button className="admin-button" onClick={onDelete}>
            Delete Post Media
          </button>
        </>
      );

    case "video":
      return (
        <>
          <label className="admin-input-label">Media</label>
          <div className="admin-media">
            <video
              src={`/static/posts/medias/${id}/390.webm`}
              controls={true}
            />
          </div>
          <button className="admin-button" onClick={onDelete}>
            Delete Post Media
          </button>
        </>
      );

    default:
      return (
        <>
          <button className="admin-button" onClick={onCreate}>
            Create Post Media
          </button>
        </>
      );
  }
};

interface UpdatePostFormProps {
  id: string;
  adminSecret: string;
  onCreateMedia: () => void;
  onDeleteMedia: () => void;
}

const UpdatePostForm: React.FC<UpdatePostFormProps> = ({
  id,
  adminSecret,
  onCreateMedia,
  onDeleteMedia,
}) => {
  const { data: postDetails } = useQuery({
    queryKey: ["admin/posts", id, adminSecret],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`, {
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

  return (
    <>
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
      <ActionButton
        label="Update Post"
        processingLabel="Updating Post..."
        errorLabel="Failed to Update Post"
        disabled={!postDetails || !post}
        onAction={async () => {
          const res = await fetch(`/api/admin/posts/${id}`, {
            method: "PUT",
            headers: {
              "admin-secret": adminSecret,
              "content-type": "application/json",
            },
            body: JSON.stringify(post),
          });
          if (!res.ok) throw new Error(res.statusText);
        }}
      />
      {postDetails && (
        <MediaForm
          id={postDetails.id}
          mediaType={postDetails.mediaType}
          onCreate={onCreateMedia}
          onDelete={onDeleteMedia}
        />
      )}
    </>
  );
};

interface CreatePostMediaFormProps {
  id: string;
  adminSecret: string;
  onCreated: () => void;
}

const CreatePostMediaForm: React.FC<CreatePostMediaFormProps> = ({
  id,
  adminSecret,
  onCreated,
}) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  return (
    <>
      <FileInput
        label="Media"
        accept="image/*,video/*"
        onFileChanged={(file) => {
          setMediaFile(file);
        }}
      />
      <ActionButton
        label="Create Post Media"
        processingLabel="Deleting Post Media..."
        errorLabel="Failed to Delete Post Media"
        disabled={!mediaFile}
        onAction={async () => {
          if (mediaFile) {
            const formData = new FormData();
            formData.append("file", mediaFile);

            const res = await fetch(`/api/admin/posts/${id}/media`, {
              method: "POST",
              headers: { "admin-secret": adminSecret },
              body: formData,
            });
            if (!res.ok) throw new Error(res.statusText);

            onCreated();
          }
        }}
      />
    </>
  );
};

export interface PostDetailsPageProps {
  id: string;
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
          <UpdatePostForm
            id={id}
            adminSecret={adminSecret}
            onCreateMedia={() => {
              setPage("create-media");
            }}
            onDeleteMedia={() => {
              setPage("confirm-media-delete");
            }}
          />
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
        <>
          <h1 className="admin-title">Confirm Delete Post {id}</h1>
          <ActionButton
            label="Delete Post"
            processingLabel="Deleting Post..."
            errorLabel="Failed to Delete Post"
            onAction={async () => {
              const res = await fetch(`/api/admin/posts/${id}`, {
                method: "DELETE",
                headers: { "admin-secret": adminSecret },
              });
              if (!res.ok) throw new Error(res.statusText);
              onBack();
            }}
          />
          <button
            className="admin-button"
            onClick={() => {
              setPage("main");
            }}
          >
            Cancel
          </button>
        </>
      );

    case "create-media":
      return (
        <>
          <h1 className="admin-title">Create Post {id} Media</h1>
          <button
            className="admin-button"
            onClick={() => {
              setPage("main");
            }}
          >
            Back
          </button>
          <CreatePostMediaForm
            id={id}
            adminSecret={adminSecret}
            onCreated={() => {
              setPage("main");
            }}
          />
        </>
      );

    case "confirm-media-delete":
      return (
        <>
          <h1 className="admin-title">Confirm Delete Post {id} Media</h1>
          <ActionButton
            label="Delete Post Media"
            processingLabel="Deleting Post Media..."
            errorLabel="Failed to Delete Post Media"
            onAction={async () => {
              const res = await fetch(`/api/admin/posts/${id}/media`, {
                method: "DELETE",
                headers: { "admin-secret": adminSecret },
              });
              if (!res.ok) throw new Error(res.statusText);
              setPage("main");
            }}
          />
          <button
            className="admin-button"
            onClick={() => {
              setPage("main");
            }}
          >
            Cancel
          </button>
        </>
      );
  }
};

export default PostDetailsPage;
