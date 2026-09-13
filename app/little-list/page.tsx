"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M2 6l3 3 5-6"
        fill="none"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LittleListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [justFinished, setJustFinished] = useState(false);
  const wasAllDoneRef = useRef(false);

  const { doneCount, total, progressPct } = useMemo(() => {
    const doneCount = todos.filter((t) => t.done).length;
    const total = todos.length;
    return {
      doneCount,
      total,
      progressPct: total > 0 ? (doneCount / total) * 100 : 0,
    };
  }, [todos]);

  const statusMessage =
    total > 0
      ? doneCount === total
        ? "今天就做到這裡，剩下的時間留給自己。"
        : doneCount === 0
          ? "不用急，先從第一件開始。"
          : null
      : null;

  useEffect(() => {
    const allDone = total > 0 && doneCount === total;
    if (allDone && !wasAllDoneRef.current) {
      setJustFinished(true);
      const timer = window.setTimeout(() => setJustFinished(false), 700);
      wasAllDoneRef.current = allDone;
      return () => window.clearTimeout(timer);
    }
    wasAllDoneRef.current = allDone;
  }, [doneCount, total]);

  const addTodo = () => {
    const text = newText.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text,
        done: false,
      },
    ]);
    setNewText("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const saveEdit = () => {
    const text = editValue.trim();
    if (text && editingId) {
      setTodos((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, text } : t)),
      );
    }
    setEditingId(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) cancelEdit();
  };

  const resetToday = () => {
    setTodos([]);
    setConfirmingReset(false);
    cancelEdit();
  };

  return (
    <main className="min-h-screen w-full bg-[#F7F4EE] px-4 py-10 text-[#2F2F2F]">
      <div className="mx-auto w-full max-w-md space-y-6">
        <header className="space-y-3 text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-[#9C9284] uppercase">
            Today&apos;s Little List
          </p>
          <h1 className="text-2xl font-bold">今日小清單</h1>
          <p className="text-sm text-[#9C9284]">
            事情很多的時候，先把今天放得下的幾件事寫下來。
          </p>
          <p className="text-sm leading-relaxed text-[#9C9284]">
            不用一次記住所有事情。把今天真正需要完成的事留下來，一件一件慢慢劃掉就好。
          </p>
        </header>

        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTodo();
            }}
          >
            <label className="block">
              <span className="text-sm text-[#9C9284]">今天想完成什麼？</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="寫下一件今天的事……"
                  className="flex-1 rounded-xl border border-[#E3DED4] bg-white px-3 py-2 text-[#2F2F2F] focus:ring-2 focus:ring-[#E6A57E] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#E6A57E] px-4 py-2 font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#D08F63]"
                >
                  放進今天
                </button>
              </div>
            </label>
          </form>
        </section>

        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <style>{`
            @keyframes checkPop {
              0% { opacity: 0; transform: scale(0.5); }
              100% { opacity: 1; transform: scale(1); }
            }
            @keyframes progressGlow {
              0% { filter: brightness(1); box-shadow: 0 0 0 rgba(230,165,126,0); }
              50% { filter: brightness(1.25); box-shadow: 0 0 10px rgba(230,165,126,0.5); }
              100% { filter: brightness(1); box-shadow: 0 0 0 rgba(230,165,126,0); }
            }
            @keyframes fadeInSoft {
              0% { opacity: 0; transform: translateY(4px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {total > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-[#9C9284]">
                今天完成 {doneCount} / {total} 件
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3E4D6]">
                <div
                  className="h-full rounded-full bg-[#E6A57E] transition-all duration-500 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    animation: justFinished
                      ? "progressGlow 700ms ease-out"
                      : "none",
                  }}
                />
              </div>
              {statusMessage && (
                <p
                  key={statusMessage}
                  className="text-sm font-medium text-[#C97B4A]"
                  style={{ animation: "fadeInSoft 400ms ease-out" }}
                >
                  {statusMessage}
                </p>
              )}
            </div>
          )}

          {total === 0 ? (
            <div className="space-y-1 py-6 text-center">
              <p className="text-sm text-[#9C9284]">今天還是一張空白頁。</p>
              <p className="text-xs text-[#B7AFA2]">想到什麼，再慢慢寫進來。</p>
            </div>
          ) : (
            <ul className="divide-y divide-dashed divide-[#E3DED4]">
              {todos.map((todo) => (
                <li key={todo.id} className="py-3">
                  {editingId === todo.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 rounded-xl border border-[#E3DED4] bg-white px-3 py-2 text-[#2F2F2F] focus:ring-2 focus:ring-[#E6A57E] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="text-sm text-[#C97B4A] hover:text-[#2F2F2F]"
                      >
                        儲存
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-sm text-[#9C9284] hover:text-[#2F2F2F]"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div
                        className="flex min-w-0 flex-1 items-start gap-3"
                        style={{
                          opacity: todo.done ? 0.82 : 1,
                          transition: "opacity 300ms ease-out",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => toggleTodo(todo.id)}
                          aria-pressed={todo.done}
                          aria-label={todo.done ? "取消完成" : "標記完成"}
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                            todo.done
                              ? "border-[#E6A57E] bg-[#E6A57E]"
                              : "border-[#E3DED4] bg-white"
                          }`}
                        >
                          {todo.done && (
                            <span
                              style={{
                                animation: "checkPop 200ms ease-out",
                              }}
                            >
                              <CheckIcon />
                            </span>
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <span className="relative inline-block">
                            <span
                              style={{
                                color: todo.done ? "#726A5E" : "#2F2F2F",
                                transition: "color 400ms ease-out",
                              }}
                            >
                              {todo.text}
                            </span>
                            <span
                              className="pointer-events-none absolute top-1/2 left-0 h-[1.5px] w-full bg-[#726A5E]"
                              style={{
                                transform: todo.done
                                  ? "scaleX(1)"
                                  : "scaleX(0)",
                                transformOrigin: "left",
                                transition: "transform 400ms ease-out",
                              }}
                            />
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => startEdit(todo)}
                          className="text-[#9C9284] hover:text-[#2F2F2F]"
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTodo(todo.id)}
                          className="text-[#9C9284] hover:text-[#2F2F2F]"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {total > 0 && (
            <div className="pt-1 text-center">
              {confirmingReset ? (
                <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#9C9284]">
                  <span>清空今天所有待辦？</span>
                  <button
                    type="button"
                    onClick={resetToday}
                    className="font-medium text-[#C97B4A] hover:text-[#2F2F2F]"
                  >
                    確定
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(false)}
                    className="hover:text-[#2F2F2F]"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingReset(true)}
                  className="text-xs text-[#B7AFA2] transition-colors hover:text-[#9C9284]"
                >
                  重新開始今天
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
