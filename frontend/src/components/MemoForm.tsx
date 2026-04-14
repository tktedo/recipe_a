"use client";

import { useState, useEffect } from "react";
import { Memo, MemoCreate } from "@/lib/api";
import styles from "./MemoForm.module.css";

interface Props {
  onSubmit: (data: MemoCreate) => Promise<void>;
  onCancel?: () => void;
  initialData?: Memo;
  loading?: boolean;
}

export default function MemoForm({ onSubmit, onCancel, initialData, loading }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");

  useEffect(() => {
    setTitle(initialData?.title ?? "");
    setContent(initialData?.content ?? "");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await onSubmit({ title: title.trim(), content: content.trim() });
    if (!initialData) {
      setTitle("");
      setContent("");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className={styles.textarea}
        placeholder="Write your memo..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
      />
      <div className={styles.actions}>
        {onCancel && (
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update" : "Add Memo"}
        </button>
      </div>
    </form>
  );
}
