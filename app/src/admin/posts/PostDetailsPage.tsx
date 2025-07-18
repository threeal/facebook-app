import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { parseAdminPostDetails } from "shared";
import { useParseAdminSubmitPost } from "../hooks";
import ActionButton from "../inputs/ActionButton";
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

interface UpdatePostFormProps {
  id: number;
  adminSecret: string;
}

const UpdatePostForm: React.FC<UpdatePostFormProps> = ({ id, adminSecret }) => {
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
          const res = await fetch(`/api/admin/posts/${id.toFixed()}`, {
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
        <MediaForm id={postDetails.id} mediaType={postDetails.mediaType} />
      )}
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
          <UpdatePostForm id={id} adminSecret={adminSecret} />
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
              const res = await fetch(`/api/admin/posts/${id.toFixed()}`, {
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
  }
};

export default PostDetailsPage;
