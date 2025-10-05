"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, Zap, Clock, XCircle } from "lucide-react";

const quickActions = [
  {
    label: "Renouvellements cette semaine",
    query: "Quels sont mes renouvellements cette semaine ?",
    icon: Clock,
  },
  {
    label: "Abonnements à annuler",
    query: "Liste les abonnements marqués à annuler",
    icon: XCircle,
  },
  {
    label: "Coût total mensuel",
    query: "Quel est mon coût total mensuel ?",
    icon: Sparkles,
  },
  {
    label: "Créer un abonnement",
    query: "Créer un nouvel abonnement",
    icon: Zap,
  },
];

export default function AgentPage() {
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "👋 Bonjour ! Je suis votre assistant Mymoni. Je peux vous aider à gérer vos abonnements, créer des alertes, et répondre à vos questions. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function send(customMsg?: string) {
    const messageToSend = customMsg || msg;
    if (!messageToSend.trim()) return;

    const messages = [
      ...history,
      { role: "user" as const, content: messageToSend },
    ];
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
        {
          role: "assistant",
          content: "❌ Erreur de connexion. Veuillez réessayer.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          Agent Mymoni
        </h1>
        <p className="text-muted-foreground">
          Votre assistant intelligent pour gérer vos abonnements
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 md:grid-cols-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => send(action.query)}
              disabled={loading}
              className="flex items-center gap-3 rounded-2xl border bg-card p-4 hover:bg-accent transition-colors text-left disabled:opacity-50"
            >
              <div className="rounded-xl bg-primary/10 p-2">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.query}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chat Area */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="border-b bg-card/50 px-4 py-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Agent Mymoni</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <p className="text-xs text-muted-foreground">En ligne</p>
            </div>
          </div>
          <div className="ml-auto">
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              IA Activée
            </Badge>
          </div>
        </div>

        <div className="h-[500px] overflow-auto p-6 space-y-4">
          {history.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-xs font-semibold">Mymoni</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span className="inline-block animate-pulse text-sm">
                    Réflexion en cours...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 bg-card/50">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Posez une question ou donnez une instruction..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && send()}
              disabled={loading}
              className="flex-1"
            />
            <Button onClick={() => send()} disabled={loading || !msg.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Astuce : Essayez "Quels sont mes renouvellements cette semaine ?" ou
            "Marque Netflix à annuler"
          </p>
        </div>
      </div>

      {/* Capabilities */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Capacités de l'agent</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-start gap-3 p-3 rounded-xl border">
            <div className="rounded-lg bg-primary/10 p-2">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Gestion des renouvellements</p>
              <p className="text-xs text-muted-foreground">
                Liste et filtre les abonnements par date d'échéance
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl border">
            <div className="rounded-lg bg-amber-500/10 p-2">
              <XCircle className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Marquage à annuler</p>
              <p className="text-xs text-muted-foreground">
                Marque les abonnements que vous souhaitez résilier
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl border">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Création d'abonnements</p>
              <p className="text-xs text-muted-foreground">
                Ajoute de nouveaux abonnements via conversation
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl border">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <Zap className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Gestion des alertes</p>
              <p className="text-xs text-muted-foreground">
                Snooze et résout les alertes automatiquement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
