import React from "react";

export interface NumberInputProps {
  label: string;
  accept?: string;
  disabled?: boolean;
  onFileChanged: (file: File | null) => void;
}

export const FileInput: React.FC<NumberInputProps> = ({
  label,
  accept,
  disabled,
  onFileChanged,
}) => {
  return (
    <>
      <label className="admin-input-label">{label}</label>
      <input
        className="admin-input"
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(e) => {
          onFileChanged(e.target.files ? e.target.files[0] : null);
        }}
      />
    </>
  );
};

export default FileInput;
