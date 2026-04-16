"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const token = await api.login(email, password);
      localStorage.setItem("access_token", token.access_token);
      router.push("/");
    } catch {
      setError("メールアドレスまたはパスワードが正しくありません");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm mode="login" onSubmit={handleLogin} error={error} loading={loading} />;
}
