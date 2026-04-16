const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Memo {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface MemoCreate {
  title: string;
  content: string;
}

export interface MemoUpdate {
  title?: string;
  content?: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

async function request<T>(path: string, options?: RequestInit, auth = false): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // auth
  register: (email: string, password: string) =>
    request<User>("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    request<Token>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request<User>("/api/auth/me", {}, true),

  // memos
  listMemos: () => request<Memo[]>("/api/memos/", {}, true),
  getMemo: (id: number) => request<Memo>(`/api/memos/${id}`, {}, true),
  createMemo: (data: MemoCreate) =>
    request<Memo>("/api/memos/", { method: "POST", body: JSON.stringify(data) }, true),
  updateMemo: (id: number, data: MemoUpdate) =>
    request<Memo>(`/api/memos/${id}`, { method: "PUT", body: JSON.stringify(data) }, true),
  deleteMemo: (id: number) =>
    request<void>(`/api/memos/${id}`, { method: "DELETE" }, true),
};
