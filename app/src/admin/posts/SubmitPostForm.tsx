import React, { useMemo, useState } from "react";
import { parseAdminSubmitPost, type AdminSubmitPostInput } from "shared";
import { useAdminUsers } from "../hooks";

interface AuthorOptionsProps {
  adminSecret: string;
}

const AuthorOptions: React.FC<AuthorOptionsProps> = ({ adminSecret }) => {
  const users = useAdminUsers(adminSecret);
  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));

  return sortedUsers.map(({ id, name }) => (
    <option key={id} value={id}>
      {name}
    </option>
  ));
};

export interface SubmitPostFormProps {
  adminSecret: string;
  disabled: boolean;
  onSubmit: (post: AdminSubmitPostInput) => void;
  children: React.ReactNode;
}

export const SubmitPostForm: React.FC<SubmitPostFormProps> = ({
  adminSecret,
  disabled,
  onSubmit,
  children,
}) => {
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

  return (
    <>
      <select
        className="admin-input"
        defaultValue={-1}
        disabled={disabled}
        onChange={(e) => {
          setAuthorId(parseInt(e.target.value));
        }}
      >
        <option value={-1} disabled hidden>
          Select Author
        </option>
        <AuthorOptions adminSecret={adminSecret} />
      </select>
      <input
        className="admin-input"
        type="date"
        disabled={disabled}
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
        disabled={disabled}
        onChange={(e) => {
          setCaption(e.target.value);
        }}
      ></textarea>
      <input
        className="admin-input"
        type="number"
        placeholder="Reactions"
        inputMode="numeric"
        disabled={disabled}
        onChange={(e) => {
          setReactions(e.target.valueAsNumber);
        }}
      />
      <button
        className="admin-button"
        disabled={disabled || !post}
        onClick={() => {
          if (post) onSubmit(post);
        }}
      >
        {children}
      </button>
    </>
  );
};
