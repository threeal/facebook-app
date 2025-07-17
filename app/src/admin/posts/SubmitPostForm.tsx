import React, { useMemo, useState } from "react";
import { parseAdminSubmitPost, type AdminSubmitPostInput } from "shared";
import NumberInput from "../inputs/NumberInput";
import TextAreaInput from "../inputs/TextAreaInput";
import TimestampInput from "../inputs/TimestampInput";
import UserSelectInput from "../inputs/UserSelectInput";

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
  const [authorId, setAuthorId] = useState(initialAuthorId ?? -1);
  const [timestamp, setTimestamp] = useState(initialTimestamp ?? -1);
  const [caption, setCaption] = useState(initialCaption ?? "");
  const [reactions, setReactions] = useState(initialReactions ?? 0);

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
      <UserSelectInput
        adminSecret={adminSecret}
        label="Author"
        disabled={disabled}
        initialUserId={initialAuthorId}
        onUserSelected={(userId) => {
          setAuthorId(userId);
        }}
      />
      <TimestampInput
        label="Date"
        disabled={disabled}
        initialTimestamp={initialTimestamp}
        onTimestampChanged={(timestamp) => {
          setTimestamp(timestamp);
        }}
      />
      <TextAreaInput
        label="Caption"
        disabled={disabled}
        initialText={initialCaption}
        onTextChanged={(text) => {
          setCaption(text);
        }}
      />
      <NumberInput
        label="Reactions"
        disabled={disabled}
        initialValue={initialReactions}
        onValueChanged={(value) => {
          setReactions(value);
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
