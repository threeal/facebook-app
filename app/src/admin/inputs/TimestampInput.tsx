import React, { useEffect, useRef } from "react";

export interface TimestampInputProps {
  label: string;
  disabled?: boolean;
  initialTimestamp?: number;
  onTimestampChanged: (timestamp: number) => void;
}

export const TimestampInput: React.FC<TimestampInputProps> = ({
  label,
  disabled,
  initialTimestamp,
  onTimestampChanged,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const setTimetampFromDate = (date: Date | null) => {
    if (date) {
      const milliseconds = date.getTime();
      onTimestampChanged(Math.floor(milliseconds / 1000));
    } else {
      onTimestampChanged(-1);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      if (initialTimestamp !== undefined) {
        inputRef.current.valueAsDate = new Date(initialTimestamp * 1000);
      }
      setTimetampFromDate(inputRef.current.valueAsDate);
    }
  }, [initialTimestamp, inputRef]);

  return (
    <>
      <label className="admin-input-label">{label}</label>
      <input
        className="admin-input"
        type="date"
        ref={inputRef}
        disabled={disabled}
        onChange={(e) => {
          setTimetampFromDate(e.target.valueAsDate);
        }}
      />
    </>
  );
};

export default TimestampInput;
