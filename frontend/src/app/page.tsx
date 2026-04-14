"use client";

import { useEffect, useState, useCallback } from "react";
import { api, Memo, MemoCreate } from "@/lib/api";
import MemoForm from "@/components/MemoForm";
import MemoCard from "@/components/MemoCard";
import styles from "./page.module.css";

export default function Home() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMemos = useCallback(async () => {
    try {
      const data = await api.listMemos();
      setMemos(data);
      setError(null);
    } catch {
      setError("Failed to load memos. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  const handleCreate = async (data: MemoCreate) => {
    setCreating(true);
    try {
      const memo = await api.createMemo(data);
      setMemos((prev) => [memo, ...prev]);
    } catch {
      setError("Failed to create memo.");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (id: number, data: MemoCreate) => {
    const memo = await api.updateMemo(id, data);
    setMemos((prev) => prev.map((m) => (m.id === id ? memo : m)));
  };

  const handleDelete = async (id: number) => {
    await api.deleteMemo(id);
    setMemos((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Memo App</h1>
        <p className={styles.subtitle}>{memos.length} memo{memos.length !== 1 ? "s" : ""}</p>
      </header>

      <section className={styles.formSection}>
        <h2 className={styles.sectionTitle}>New Memo</h2>
        <MemoForm onSubmit={handleCreate} loading={creating} />
      </section>

      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.list}>
        {loading ? (
          <p className={styles.empty}>Loading...</p>
        ) : memos.length === 0 ? (
          <p className={styles.empty}>No memos yet. Create your first one above!</p>
        ) : (
          memos.map((memo) => (
            <MemoCard
              key={memo.id}
              memo={memo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </section>
    </main>
  );
}
