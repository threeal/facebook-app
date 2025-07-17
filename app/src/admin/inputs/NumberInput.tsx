import React, { useEffect, useRef } from "react";

export interface NumberInputProps {
  label: string;
  disabled?: boolean;
  initialValue?: number;
  onValueChanged: (value: number) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  disabled,
  initialValue,
  onValueChanged,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      if (initialValue !== undefined) {
        inputRef.current.valueAsNumber = initialValue;
      }
      onValueChanged(inputRef.current.valueAsNumber);
    }
  }, [initialValue, inputRef]);

  return (
    <>
      <label className="admin-input-label">{label}</label>
      <input
        className="admin-input"
        type="number"
        inputMode="numeric"
        ref={inputRef}
        defaultValue={0}
        disabled={disabled}
        onChange={(e) => {
          onValueChanged(e.target.valueAsNumber);
        }}
      />
    </>
  );
};

export default NumberInput;
