import React, { useEffect, useRef } from "react";

export interface TextInputProps {
  label: string;
  disabled?: boolean;
  initialText?: string;
  onTextChanged: (text: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  disabled,
  initialText,
  onTextChanged,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      if (initialText !== undefined) {
        inputRef.current.value = initialText;
      }
      onTextChanged(inputRef.current.value);
    }
  }, [initialText, inputRef]);

  return (
    <>
      <label className="admin-input-label">{label}</label>
      <input
        className="admin-input"
        type="text"
        ref={inputRef}
        disabled={disabled}
        onChange={(e) => {
          onTextChanged(e.target.value);
        }}
      />
    </>
  );
};

export default TextInput;
