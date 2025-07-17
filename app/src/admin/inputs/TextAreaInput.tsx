import React, { useEffect, useRef } from "react";

export interface TextAreaInputProps {
  label: string;
  disabled?: boolean;
  initialText?: string;
  onTextChanged: (text: string) => void;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  disabled,
  initialText,
  onTextChanged,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      if (initialText !== undefined) {
        textAreaRef.current.value = initialText;
      }
      onTextChanged(textAreaRef.current.value);
    }
  }, [initialText, textAreaRef]);

  return (
    <>
      <label className="admin-input-label">{label}</label>
      <textarea
        className="admin-input"
        ref={textAreaRef}
        disabled={disabled}
        onChange={(e) => {
          onTextChanged(e.target.value);
        }}
      />
    </>
  );
};

export default TextAreaInput;
