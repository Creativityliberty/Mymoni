"use client";

import { useState } from "react";
import { Bot, Send, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatDock() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!msg.trim()) return;

    const messages = [...history, { role: "user" as const, content: msg }];
    setHistory(messages);
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      setHistory([
        ...messages,
        { role: "assistant", content: data.reply ?? "(ok)" },
      ]);
    } catch (e) {
      setHistory([
        ...messages,
        { role: "assistant", content: "Erreur de connexion." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 rounded-full bg-primary text-primary-foreground p-4 shadow-lg hover:scale-105 transition-transform"
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[380px] h-[500px] flex flex-col rounded-2xl border bg-background shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-card/50">
        <Bot className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold">Agent Mymoni</span>
        <div className="ml-auto flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-7 w-7 p-0"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {history.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            <Bot className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p>Posez-moi une question sur vos abonnements !</p>
            <p className="text-xs mt-2">
              Ex: "Quels sont mes renouvellements cette semaine ?"
            </p>
          </div>
        )}
        {history.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-2 text-sm">
              <span className="inline-block animate-pulse">●●●</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-card/50">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Posez une question…"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && send()}
            disabled={loading}
          />
          <Button onClick={send} disabled={loading} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
