const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;
const configuredApiBase = env.VITE_API_BASE_URL?.trim();
const currentProtocol = typeof window !== "undefined" ? window.location.protocol : "http:";
const currentHost = typeof window !== "undefined" ? window.location.hostname : "localhost";
const apiPort = env.VITE_API_PORT?.trim() || "3001";

export const API_BASE_URL = configuredApiBase || `${currentProtocol}//${currentHost}:${apiPort}/api`;
const TODOS_BASE_URL = `${API_BASE_URL}/todos`;

export interface Todo {
  id: string;
  user_id: string | null;
  text: string;
  completed: boolean;
  created_at: string;
}

function getHeaders(userId: string, includeJson = false): HeadersInit {
  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    "x-user-id": userId,
  };
}

async function parseJson<T>(res: Response, fallbackMessage: string): Promise<T> {
  const data = (await res.json().catch(() => null)) as { error?: string } | T | null;
  if (!res.ok) {
    throw new Error(
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : fallbackMessage
    );
  }
  return data as T;
}

export async function fetchTodos(userId: string): Promise<Todo[]> {
  const res = await fetch(TODOS_BASE_URL, {
    headers: getHeaders(userId),
  });
  return parseJson<Todo[]>(res, "Failed to fetch todos");
}

export async function createTodo(userId: string, text: string): Promise<Todo> {
  const res = await fetch(TODOS_BASE_URL, {
    method: "POST",
    headers: getHeaders(userId, true),
    body: JSON.stringify({ text }),
  });
  return parseJson<Todo>(res, "Failed to create todo");
}

export async function updateTodo(
  userId: string,
  id: string,
  updates: { text?: string; completed?: boolean }
): Promise<Todo> {
  const res = await fetch(`${TODOS_BASE_URL}/${id}`, {
    method: "PATCH",
    headers: getHeaders(userId, true),
    body: JSON.stringify(updates),
  });
  return parseJson<Todo>(res, "Failed to update todo");
}

export async function deleteTodo(userId: string, id: string): Promise<void> {
  const res = await fetch(`${TODOS_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(userId),
  });
  await parseJson<{ message: string }>(res, "Failed to delete todo");
}

export async function clearCompletedTodos(userId: string): Promise<void> {
  const res = await fetch(`${TODOS_BASE_URL}/completed/clear`, {
    method: "DELETE",
    headers: getHeaders(userId),
  });
  await parseJson<{ message: string; clearedCount: number }>(res, "Failed to clear completed todos");
}
