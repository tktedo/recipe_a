"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, Memo, MemoCreate, User } from "@/lib/api";
import MemoForm from "@/components/MemoForm";
import MemoCard from "@/components/MemoCard";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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
      setError("メモの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    api.me()
      .then((u) => {
        setUser(u);
        fetchMemos();
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        router.replace("/login");
      });
  }, [router, fetchMemos]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.replace("/login");
  };

  const handleCreate = async (data: MemoCreate) => {
    setCreating(true);
    try {
      const memo = await api.createMemo(data);
      setMemos((prev) => [memo, ...prev]);
    } catch {
      setError("メモの作成に失敗しました");
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

  if (!user) return null;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Memo App</h1>
          <p className={styles.subtitle}>{memos.length} memo{memos.length !== 1 ? "s" : ""}</p>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.email}>{user.email}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>ログアウト</button>
        </div>
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
          <p className={styles.empty}>メモがまだありません。上から作成してみてください！</p>
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
