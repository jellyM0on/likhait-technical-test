import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import React from "react";
import { useCategoryForm } from "../hooks/useCategoryForm";
import { Button, TextField } from "../vibes";
import { CategoryFormData } from "../types";


interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Category",
}: CategoryFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    showPicker,
    handleChange,
    handleSubmit,
    togglePicker,
    closePicker,
  } = useCategoryForm({ initialData, onSubmit });

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  };

  const sectionStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "20px",
  };

  const helperStyle: React.CSSProperties = {
    fontSize: 13,
    lineHeight: "18px",
    color: "#6B7280",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: 13,
    lineHeight: "18px",
    color: "#DC2626",
    marginTop: 2,
  };

  const emojiRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
  };

  const emojiButtonStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    borderRadius: 12,
    border: `1px solid ${errors.emoji ? "#DC2626" : "#D1D5DB"}`,
    background: "#fff",
    cursor: "pointer",
    flexShrink: 0,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  };

  const emojiPreviewStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  const pickerWrapStyle: React.CSSProperties = {
    marginTop: 10,
    borderRadius: 14,
    border: "1px solid #E5E7EB",
    overflow: "hidden",
    background: "#fff",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: 10,
    marginTop: 4,
    alignItems: "center",
  };

  const cancelWrapStyle: React.CSSProperties = {
    minWidth: 110,
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    handleChange("emoji", emojiData.emoji);
    closePicker();
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={sectionStyle}>
        <TextField
          label="Category Name"
          type="text"
          placeholder="Enter category name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          fullWidth
          required
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Category Emoji</div>

        <div style={emojiRowStyle}>
          <button
            type="button"
            style={emojiButtonStyle}
            onClick={togglePicker}
            aria-label="Choose category emoji"
          >
            {formData.emoji}
          </button>

          <div style={emojiPreviewStyle}>
            <div style={helperStyle}>Pick an emoji for this category.</div>
            {errors.emoji && <div style={errorStyle}>{errors.emoji}</div>}
          </div>
        </div>

        {showPicker && (
          <div style={pickerWrapStyle}>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              searchDisabled={false}
              skinTonesDisabled={false}
              width="100%"
              height={360}
            />
          </div>
        )}
      </div>

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>

        {onCancel && (
          <div style={cancelWrapStyle}>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}