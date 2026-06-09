import type { KeyboardEvent, RefObject } from "react";
import type { User } from "../api/auth";
import type { Todo } from "../api/todosApi";
import { cn } from "../utils/cn";

type Filter = "all" | "active" | "completed";

type TodoWorkspaceProps = {
  currentUser: User;
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  successMessage: string | null;
  todoError: string | null;
  onDismissTodoError: () => void;
  loadingTodos: boolean;
  backendConnected: boolean;
  apiBaseUrl: string;
  todos: Todo[];
  activeCount: number;
  completedCount: number;
  filter: Filter;
  onChangeFilter: (filter: Filter) => void;
  newTodo: string;
  onNewTodoChange: (value: string) => void;
  onAddTodo: () => void | Promise<void>;
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  filteredTodos: Todo[];
  editingId: string | null;
  editText: string;
  onEditTextChange: (value: string) => void;
  onStartEditing: (todo: Todo) => void;
  onSaveEdit: () => void | Promise<void>;
  editInputRef: RefObject<HTMLInputElement | null>;
  onToggleTodo: (id: string) => void | Promise<void>;
  onDeleteTodo: (id: string) => void | Promise<void>;
  onClearCompleted: () => void | Promise<void>;
};

export function TodoWorkspace({
  currentUser,
  isDark,
  onToggleTheme,
  onLogout,
  successMessage,
  todoError,
  onDismissTodoError,
  loadingTodos,
  backendConnected,
  apiBaseUrl,
  todos,
  activeCount,
  completedCount,
  filter,
  onChangeFilter,
  newTodo,
  onNewTodoChange,
  onAddTodo,
  onInputKeyDown,
  inputRef,
  filteredTodos,
  editingId,
  editText,
  onEditTextChange,
  onStartEditing,
  onSaveEdit,
  editInputRef,
  onToggleTodo,
  onDeleteTodo,
  onClearCompleted,
}: TodoWorkspaceProps) {
  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-10 transition-colors dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {currentUser.avatar_url ? (
              <img src={currentUser.avatar_url} alt={currentUser.name} className="h-14 w-14 rounded-2xl object-cover shadow-md" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-semibold text-white shadow-lg shadow-indigo-500/20">
                {currentUser.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                Signed in with {currentUser.auth_provider === "google" ? "Google" : "email"}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Welcome back, {currentUser.name.split(" ")[0]}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your personal TodoFlow workspace.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              onClick={onToggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-lg dark:bg-zinc-800"
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <button
              onClick={onLogout}
              className="rounded-2xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Log out
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            {successMessage}
          </div>
        )}

        {todoError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            <span className="mt-0.5">⚠️</span>
            <div className="flex-1">{todoError}</div>
            <button onClick={onDismissTodoError} className="text-red-400 hover:text-red-600">
              ✕
            </button>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium",
              loadingTodos
                ? "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-300"
                : backendConnected
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                loadingTodos
                  ? "animate-pulse bg-yellow-400"
                  : backendConnected
                    ? "bg-emerald-400"
                    : "bg-red-400"
              )}
            />
            {loadingTodos ? "Loading your workspace..." : backendConnected ? "Workspace connected" : "Workspace offline"}
          </div>
          <div className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            API: {apiBaseUrl}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Your tasks</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Add, edit, complete, or remove tasks from your personal list.</p>
              </div>
              <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {todos.length} total
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={newTodo}
                  onChange={(event) => onNewTodoChange(event.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="What needs to be done next?"
                  disabled={loadingTodos}
                  className="w-full rounded-3xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-base outline-none transition focus:border-indigo-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-400"
                />
                <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs text-zinc-400">⏎</div>
              </div>
              <button
                onClick={() => void onAddTodo()}
                disabled={!newTodo.trim() || loadingTodos}
                className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Add task
              </button>
            </div>

            {loadingTodos ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-500">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent" />
                <p className="mt-4 text-sm">Loading your tasks...</p>
              </div>
            ) : todos.length === 0 ? (
              <div className="mt-6 rounded-[1.75rem] border border-dashed border-zinc-200 bg-zinc-50/70 px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950/50">
                <div className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">No tasks yet</div>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Start by adding your first task above.</p>
              </div>
            ) : (
              <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-zinc-200 dark:border-zinc-800">
                <div className="max-h-[520px] overflow-auto bg-white dark:bg-zinc-900">
                  {filteredTodos.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                      No {filter} tasks found.
                    </div>
                  ) : (
                    filteredTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className={cn(
                          "group flex items-center gap-4 border-b border-zinc-100 px-6 py-4 last:border-b-0 dark:border-zinc-800",
                          todo.completed && "opacity-75"
                        )}
                      >
                        <button
                          onClick={() => void onToggleTodo(todo.id)}
                          className={cn(
                            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition",
                            todo.completed
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-zinc-300 bg-white text-transparent hover:border-indigo-400 dark:border-zinc-600 dark:bg-zinc-900"
                          )}
                        >
                          ✓
                        </button>

                        <div className="min-w-0 flex-1">
                          {editingId === todo.id ? (
                            <input
                              ref={editInputRef}
                              value={editText}
                              onChange={(event) => onEditTextChange(event.target.value)}
                              onBlur={() => void onSaveEdit()}
                              onKeyDown={onInputKeyDown}
                              className="w-full border-b border-dashed border-zinc-300 bg-transparent pb-1 text-[15px] font-medium outline-none dark:border-zinc-700 dark:text-white"
                            />
                          ) : (
                            <button
                              onDoubleClick={() => onStartEditing(todo)}
                              className={cn(
                                "w-full text-left text-[15px] font-medium",
                                todo.completed
                                  ? "text-zinc-400 line-through dark:text-zinc-500"
                                  : "text-zinc-800 dark:text-zinc-100"
                              )}
                            >
                              {todo.text}
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => void onDeleteTodo(todo.id)}
                          className="rounded-full p-2 text-zinc-300 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-zinc-600 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Workspace summary</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Active", value: activeCount, tone: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300" },
                  { label: "Done", value: completedCount, tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
                  { label: "Filter", value: filter[0].toUpperCase() + filter.slice(1), tone: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300" },
                  { label: "Provider", value: currentUser.auth_provider, tone: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" },
                ].map((item) => (
                  <div key={item.label} className={cn("rounded-3xl px-4 py-5", item.tone)}>
                    <div className="text-xs font-medium uppercase tracking-[0.18em] opacity-70">{item.label}</div>
                    <div className="mt-2 text-2xl font-semibold capitalize">{item.value}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Filters</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["all", "active", "completed"] as Filter[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => onChangeFilter(option)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      filter === option
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    )}
                  >
                    {option === "completed" ? "Done" : option[0].toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>

              {completedCount > 0 && (
                <button
                  onClick={() => void onClearCompleted()}
                  className="mt-5 w-full rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/30"
                >
                  Clear completed tasks
                </button>
              )}
            </section>

            <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-xl shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:shadow-none">
              <div className="font-semibold text-zinc-900 dark:text-white">Tips</div>
              <ul className="mt-4 space-y-3 leading-6">
                <li>• Press Enter to add a task or save an edit.</li>
                <li>• Double-click a task to rename it.</li>
                <li>• Your tasks are scoped to <span className="font-medium text-zinc-700 dark:text-zinc-200">{currentUser.email}</span>.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}