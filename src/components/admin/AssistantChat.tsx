"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadHistory() {
    const res = await fetch("/api/admin/assistant");
    const data = await res.json();
    setRemaining(data.remaining);
    setMessages(
      data.history.map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content,
      }))
    );
  }

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    setError("");
    const question = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setLoading(true);

    const res = await fetch("/api/admin/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Error al consultar el asistente");
      return;
    }

    setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
    setRemaining(data.remaining);
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-xl border border-black/10 bg-white">
      <div className="flex items-center justify-between border-b border-black/10 p-3">
        <span className="text-sm font-medium">Asistente de la tienda</span>
        <span className="text-xs text-black/50">
          {remaining !== null ? `${remaining} preguntas restantes hoy` : "..."}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-black/40">
            Pregúntame sobre inventario, productos, proveedores, ventas o pedidos.
          </p>
        )}
        <div className="flex flex-col gap-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                m.role === "user"
                  ? "self-end bg-black text-white"
                  : "self-start bg-neutral-100 text-black"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="self-start rounded-2xl bg-neutral-100 px-4 py-2 text-sm text-black/50">
              Pensando...
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      {error && <p className="px-4 text-xs text-red-600">{error}</p>}

      <div className="flex gap-2 border-t border-black/10 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ej: ¿cuánto stock me queda de fajas?"
          disabled={remaining === 0}
          className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm disabled:bg-black/5"
        />
        <button
          onClick={send}
          disabled={loading || remaining === 0}
          className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
