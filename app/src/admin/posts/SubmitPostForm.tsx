import React, { useEffect, useMemo, useRef, useState } from "react";
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
  initialAuthorId?: number;
  initialTimestamp?: number;
  initialCaption?: string;
  initialReactions?: number;
  disabled: boolean;
  onSubmit: (post: AdminSubmitPostInput) => void;
  children: React.ReactNode;
}

export const SubmitPostForm: React.FC<SubmitPostFormProps> = ({
  adminSecret,
  initialAuthorId,
  initialTimestamp,
  initialCaption,
  initialReactions,
  disabled,
  onSubmit,
  children,
}) => {
  const authorIdRef = useRef<HTMLSelectElement>(null);
  const timestampRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLTextAreaElement>(null);
  const reactionsRef = useRef<HTMLInputElement>(null);

  const [authorId, setAuthorId] = useState(initialAuthorId ?? -1);
  const [timestamp, setTimestamp] = useState(initialTimestamp ?? -1);
  const [caption, setCaption] = useState(initialCaption ?? "");
  const [reactions, setReactions] = useState(initialReactions ?? 0);

  useEffect(() => {
    if (authorIdRef.current && initialAuthorId !== undefined) {
      authorIdRef.current.value = initialAuthorId.toFixed();
      setAuthorId(initialAuthorId);
    }
  }, [authorIdRef, initialAuthorId]);

  useEffect(() => {
    if (timestampRef.current && initialTimestamp !== undefined) {
      const date = new Date(initialTimestamp * 1000);
      timestampRef.current.value = date.toISOString().split("T")[0];
      setTimestamp(initialTimestamp);
    }
  }, [timestampRef, initialTimestamp]);

  useEffect(() => {
    if (captionRef.current && initialCaption !== undefined) {
      captionRef.current.value = initialCaption;
      setCaption(initialCaption);
    }
  }, [captionRef, initialCaption]);

  useEffect(() => {
    if (reactionsRef.current && initialReactions !== undefined) {
      reactionsRef.current.value = initialReactions.toFixed();
      setReactions(initialReactions);
    }
  }, [reactionsRef, initialReactions]);

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
      <label className="admin-input-label">Author</label>
      <select
        className="admin-input"
        ref={authorIdRef}
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
      <label className="admin-input-label">Date</label>
      <input
        className="admin-input"
        type="date"
        ref={timestampRef}
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
      <label className="admin-input-label">Caption</label>
      <textarea
        className="admin-input"
        ref={captionRef}
        disabled={disabled}
        onChange={(e) => {
          setCaption(e.target.value);
        }}
      />
      <label className="admin-input-label">Reactions</label>
      <input
        className="admin-input"
        type="number"
        placeholder="0"
        inputMode="numeric"
        ref={reactionsRef}
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
