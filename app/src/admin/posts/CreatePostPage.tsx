import React, { useState } from "react";
import type { AdminCreatePostSchema } from "shared";
import { useRawUsers } from "../hooks";

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

  const users = useRawUsers(adminSecret);
  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));

  const createPost = async () => {
    setIsCreating(true);
    try {
      const data: AdminCreatePostSchema = {
        authorId,
        timestamp,
        caption,
        reactions,
      };
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "admin-secret": adminSecret,
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.statusText);
    } catch (err) {
      console.error("Failed to create post:", err);
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
      <select
        className="admin-input"
        defaultValue={-1}
        onChange={(e) => {
          setAuthorId(parseInt(e.target.value));
        }}
      >
        <option value={-1} disabled hidden>
          Select Author
        </option>
        {sortedUsers.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      <input
        className="admin-input"
        type="date"
        onChange={(e) => {
          if (e.target.valueAsDate) {
            const milliseconds = e.target.valueAsDate.getTime();
            setTimestamp(Math.floor(milliseconds / 1000));
          } else {
            setTimestamp(-1);
          }
        }}
      />
      <textarea
        className="admin-input"
        placeholder="Caption"
        onChange={(e) => {
          setCaption(e.target.value.trim());
        }}
      ></textarea>
      <input
        className="admin-input"
        type="number"
        placeholder="Reactions"
        inputMode="numeric"
        onChange={(e) => {
          setReactions(Math.floor(e.target.valueAsNumber));
        }}
      />
      <button
        className="admin-button"
        disabled={
          isCreating ||
          authorId == -1 ||
          timestamp == -1 ||
          isNaN(reactions) ||
          reactions < 0
        }
        onClick={() => void createPost()}
      >
        {isCreating ? "Creating Post..." : "Create Post"}
      </button>
    </>
  );
};

export default CreatePostPage;
