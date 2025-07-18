import { getErrorMessage } from "catched-error-message";
import React, { useState } from "react";

export interface ActionButtonProps {
  label: string;
  processingLabel: string;
  errorLabel: string;
  disabled?: boolean;
  onAction: () => Promise<void>;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  processingLabel,
  errorLabel,
  disabled,
  onAction,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const action = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await onAction();
    } catch (err) {
      console.error(errorLabel, err);
      setError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button
        className="admin-button"
        disabled={isProcessing || disabled}
        onClick={() => {
          if (!isProcessing) void action();
        }}
      >
        {isProcessing ? processingLabel : error ? errorLabel : label}
      </button>
      {error && (
        <label className="admin-input-label">
          Error: {getErrorMessage(error)}
        </label>
      )}
    </>
  );
};

export default ActionButton;
