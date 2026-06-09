import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { signupWithEmail, signupWithGoogle, type User } from "./api/auth";
import {
  API_BASE_URL,
  clearCompletedTodos,
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
  type Todo,
} from "./api/todosApi";
import { AuthScreen, TodoWorkspace } from "./components";

type Filter = "all" | "active" | "completed";

type AuthForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_black" | "filled_blue";
              size?: "large" | "medium" | "small";
              text?: string;
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: number;
              logo_alignment?: "left" | "center";
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const SESSION_STORAGE_KEY = "todoflow:user";
const googleClientId =
  (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env
    .VITE_GOOGLE_CLIENT_ID?.trim() || "";

const initialForm: AuthForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [todoError, setTodoError] = useState<string | null>(null);
  const [authForm, setAuthForm] = useState<AuthForm>(initialForm);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleGoogleAuth = useCallback(async (credential: string) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const response = await signupWithGoogle(credential);
      setCurrentUser(response.user);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(response.user));
      setSuccessMessage(response.message);
      setAuthForm(initialForm);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Google sign up failed.");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser || !googleClientId) {
      setGoogleReady(false);
      return;
    }

    let cancelled = false;
    let script = document.querySelector<HTMLScriptElement>("script[data-google-identity='true']");

    const renderGoogleButton = () => {
      if (cancelled || !window.google || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: ({ credential }) => {
          if (!credential) {
            setAuthError("Google sign up was cancelled. Please try again.");
            return;
          }

          void handleGoogleAuth(credential);
        },
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: isDark ? "filled_black" : "outline",
        size: "large",
        shape: "circle",
      });
      setGoogleReady(true);
    };

    if (window.google) {
      renderGoogleButton();
      return () => {
        cancelled = true;
      };
    }

    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = "true";
      document.body.appendChild(script);
    }

    script.addEventListener("load", renderGoogleButton);

    return () => {
      cancelled = true;
      script?.removeEventListener("load", renderGoogleButton);
    };
  }, [currentUser, handleGoogleAuth, isDark]);

  useEffect(() => {
    if (!currentUser) {
      setTodos([]);
      setTodoError(null);
      setLoadingTodos(false);
      return;
    }

    const loadTodos = async () => {
      try {
        setLoadingTodos(true);
        setTodoError(null);
        const data = await fetchTodos(currentUser.id);
        setTodos(data);
      } catch (error) {
        setTodoError(
          error instanceof Error
            ? error.message
            : `Cannot connect to the backend at ${API_BASE_URL}.`
        );
      } finally {
        setLoadingTodos(false);
      }
    };

    void loadTodos();
  }, [currentUser]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });
  }, [filter, todos]);

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;
  const backendConnected = Boolean(currentUser) && !loadingTodos && !todoError;
  const passwordLongEnough = authForm.password.trim().length >= 8;
  const passwordsMatch =
    authForm.confirmPassword.length > 0 && authForm.password === authForm.confirmPassword;
  const emailLooksValid = /\S+@\S+\.\S+/.test(authForm.email);

  const setSession = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  };

  const handleAuthInput = (field: keyof AuthForm, value: string) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmailSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { name, email, password, confirmPassword } = authForm;

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setAuthError("Please fill in all sign up fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setAuthError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    try {
      setAuthLoading(true);
      setAuthError(null);
      const response = await signupWithEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      setSession(response.user);
      setSuccessMessage(response.message);
      setAuthForm(initialForm);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Failed to create account.");
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setTodos([]);
    setFilter("all");
    setNewTodo("");
    setEditingId(null);
    setEditText("");
    setTodoError(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setSuccessMessage("Signed out successfully.");
  };

  const addTodo = async () => {
    if (!currentUser || !newTodo.trim()) return;

    try {
      const todo = await createTodo(currentUser.id, newTodo.trim());
      setTodos((prev) => [todo, ...prev]);
      setNewTodo("");
      setTodoError(null);
      setSuccessMessage("Task added.");
    } catch (error) {
      setTodoError(error instanceof Error ? error.message : "Failed to add todo.");
    }
  };

  const toggleTodo = async (id: string) => {
    if (!currentUser) return;

    const todo = todos.find((item) => item.id === id);
    if (!todo) return;

    try {
      const updated = await updateTodo(currentUser.id, id, { completed: !todo.completed });
      setTodos((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setTodoError(null);
    } catch (error) {
      setTodoError(error instanceof Error ? error.message : "Failed to update todo.");
    }
  };

  const deleteTodoById = async (id: string) => {
    if (!currentUser) return;

    try {
      await deleteTodo(currentUser.id, id);
      setTodos((prev) => prev.filter((item) => item.id !== id));
      setTodoError(null);
    } catch (error) {
      setTodoError(error instanceof Error ? error.message : "Failed to delete todo.");
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    window.setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 10);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async () => {
    if (!currentUser || !editingId) return;

    if (!editText.trim()) {
      cancelEdit();
      return;
    }

    try {
      const updated = await updateTodo(currentUser.id, editingId, { text: editText.trim() });
      setTodos((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      setTodoError(null);
      cancelEdit();
    } catch (error) {
      setTodoError(error instanceof Error ? error.message : "Failed to save changes.");
      cancelEdit();
    }
  };

  const clearCompleted = async () => {
    if (!currentUser) return;

    try {
      await clearCompletedTodos(currentUser.id);
      setTodos((prev) => prev.filter((item) => !item.completed));
      setTodoError(null);
    } catch (error) {
      setTodoError(error instanceof Error ? error.message : "Failed to clear completed todos.");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (editingId) {
        void saveEdit();
      } else {
        void addTodo();
      }
    }

    if (event.key === "Escape" && editingId) {
      cancelEdit();
    }
  };

  if (!currentUser) {
    return (
      <AuthScreen
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        authError={authError}
        successMessage={successMessage}
        authForm={authForm}
        onAuthInput={handleAuthInput}
        onSubmit={handleEmailSignup}
        authLoading={authLoading}
        passwordLongEnough={passwordLongEnough}
        passwordsMatch={passwordsMatch}
        emailLooksValid={emailLooksValid}
        googleClientId={googleClientId}
        googleReady={googleReady}
        googleButtonRef={googleButtonRef}
        apiBaseUrl={API_BASE_URL}
      />
    );
  }

  return (
    <TodoWorkspace
      currentUser={currentUser}
      isDark={isDark}
      onToggleTheme={() => setIsDark((prev) => !prev)}
      onLogout={logout}
      successMessage={successMessage}
      todoError={todoError}
      onDismissTodoError={() => setTodoError(null)}
      loadingTodos={loadingTodos}
      backendConnected={backendConnected}
      apiBaseUrl={API_BASE_URL}
      todos={todos}
      activeCount={activeCount}
      completedCount={completedCount}
      filter={filter}
      onChangeFilter={setFilter}
      newTodo={newTodo}
      onNewTodoChange={setNewTodo}
      onAddTodo={addTodo}
      onInputKeyDown={handleKeyDown}
      inputRef={inputRef}
      filteredTodos={filteredTodos}
      editingId={editingId}
      editText={editText}
      onEditTextChange={setEditText}
      onStartEditing={startEditing}
      onSaveEdit={saveEdit}
      editInputRef={editInputRef}
      onToggleTodo={toggleTodo}
      onDeleteTodo={deleteTodoById}
      onClearCompleted={clearCompleted}
    />
  );
}

