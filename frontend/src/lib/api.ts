const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  listMemos: () => request<Memo[]>("/api/memos/"),
  getMemo: (id: number) => request<Memo>(`/api/memos/${id}`),
  createMemo: (data: MemoCreate) =>
    request<Memo>("/api/memos/", { method: "POST", body: JSON.stringify(data) }),
  updateMemo: (id: number, data: MemoUpdate) =>
    request<Memo>(`/api/memos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMemo: (id: number) =>
    request<void>(`/api/memos/${id}`, { method: "DELETE" }),
};
