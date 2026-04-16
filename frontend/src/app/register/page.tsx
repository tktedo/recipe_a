"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await api.register(email, password);
      const token = await api.login(email, password);
      localStorage.setItem("access_token", token.access_token);
      router.push("/");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("already registered")) {
        setError("このメールアドレスはすでに登録されています");
      } else if (msg.includes("8")) {
        setError("パスワードは8文字以上で入力してください");
      } else {
        setError("登録に失敗しました。もう一度お試しください");
      }
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm mode="register" onSubmit={handleRegister} error={error} loading={loading} />;
}
