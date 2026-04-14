"use client";

import { useState } from "react";
import { Memo, MemoCreate } from "@/lib/api";
import MemoForm from "./MemoForm";
import styles from "./MemoCard.module.css";

interface Props {
  memo: Memo;
  onUpdate: (id: number, data: MemoCreate) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function MemoCard({ memo, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (data: MemoCreate) => {
    setLoading(true);
    try {
      await onUpdate(memo.id, data);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this memo?")) return;
    setLoading(true);
    try {
      await onDelete(memo.id);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (editing) {
    return (
      <div className={styles.card}>
        <MemoForm
          initialData={memo}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{memo.title}</h3>
        <div className={styles.btnGroup}>
          <button className={styles.editBtn} onClick={() => setEditing(true)} disabled={loading}>
            Edit
          </button>
          <button className={styles.deleteBtn} onClick={handleDelete} disabled={loading}>
            Delete
          </button>
        </div>
      </div>
      <p className={styles.content}>{memo.content}</p>
      <span className={styles.date}>{formatDate(memo.updated_at)}</span>
    </div>
  );
}
