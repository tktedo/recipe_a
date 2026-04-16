"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./AuthForm.module.css";

interface Props {
  mode: "login" | "register";
  onSubmit: (email: string, password: string) => Promise<void>;
  error: string | null;
  loading: boolean;
}

export default function AuthForm({ mode, onSubmit, error, loading }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {mode === "login" ? "ログイン" : "アカウント作成"}
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>メールアドレス</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>パスワード</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "処理中..." : mode === "login" ? "ログイン" : "登録する"}
          </button>
        </form>

        <p className={styles.link}>
          {mode === "login" ? (
            <>アカウントをお持ちでない方は<Link href="/register">新規登録</Link></>
          ) : (
            <>すでにアカウントをお持ちの方は<Link href="/login">ログイン</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
