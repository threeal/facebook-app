import React, { useEffect, useRef } from "react";
import { useAdminUsers } from "../hooks";

export interface UserSelectInputProps {
  adminSecret: string;
  label: string;
  disabled?: boolean;
  initialUserId?: string;
  onUserSelected: (userId: string) => void;
}

export const UserSelectInput: React.FC<UserSelectInputProps> = ({
  adminSecret,
  label,
  disabled,
  initialUserId,
  onUserSelected,
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const users = useAdminUsers(adminSecret);
  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (selectRef.current) {
      if (initialUserId !== undefined) {
        selectRef.current.value = initialUserId;
      }
      onUserSelected(selectRef.current.value);
    }
  }, [initialUserId, selectRef]);

  return (
    <>
      <label className="admin-input-label">{label}</label>
      <select
        className="admin-input"
        ref={selectRef}
        defaultValue={""}
        disabled={disabled}
        onChange={(e) => {
          onUserSelected(e.target.value);
        }}
      >
        <option value={""} disabled hidden>
          Select User
        </option>
        {sortedUsers.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </>
  );
};

export default UserSelectInput;
