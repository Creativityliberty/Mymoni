import { NextRequest, NextResponse } from "next/server";
import { getAction } from "@/agent/actions/registry";
import { detectIntent } from "@/agent/intent/detect";
import { format } from "date-fns";

function getSessionCtx() {
  // TODO: Get from actual session
  return {
    userId: "u_demo",
    workspaceId: "ws_demo",
    role: "admin" as const,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages = body.messages as
    | { role: "user" | "assistant"; content: string }[]
    | undefined;
  const tool = body.tool as { key: string; input: any } | undefined;

  const ctx = getSessionCtx();

  // Direct tool call
  if (tool) {
    const a = getAction(tool.key);
    if (!a)
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });

    try {
      const out = await a.handler(tool.input, ctx as any);
      return NextResponse.json({ type: "tool_result", key: a.key, data: out });
    } catch (e: any) {
      return NextResponse.json(
        { error: e.message || "Action failed" },
        { status: 500 }
      );
    }
  }

  // Intent detection from messages
  if (!messages || messages.length === 0) {
    return NextResponse.json(
      { reply: "Bonjour ! Comment puis-je vous aider ?" },
      { status: 200 }
    );
  }

  const intent = await detectIntent(messages);

  if (!intent) {
    return NextResponse.json({
      reply:
        "Je n'ai pas compris. Essayez : 'Quels sont mes renouvellements cette semaine ?'",
    });
  }

  const a = getAction(intent.actionKey);
  if (!a) {
    return NextResponse.json({
      reply: "Action non disponible.",
    });
  }

  try {
    const out = await a.handler((intent as any).input, ctx as any);
    return NextResponse.json({
      reply: renderReply(a.key, out),
      tool_result: { key: a.key, data: out },
    });
  } catch (e: any) {
    return NextResponse.json({
      reply: `Erreur : ${e.message}`,
    });
  }
}

function renderReply(key: string, data: any): string {
  switch (key) {
    case "listRenewals":
      if (data.items.length === 0) {
        return "Aucun renouvellement prévu dans cette période.";
      }
      const list = data.items
        .map(
          (i: any) =>
            `• ${i.service_name} - ${i.cost_amount.toFixed(2)} ${i.cost_currency} le ${format(new Date(i.next_renewal_date), "dd/MM/yyyy")}`
        )
        .join("\n");
      return `Renouvellements à venir :\n${list}`;

    case "markToCancel":
      return "✓ Abonnement marqué 'à annuler'.";

    case "snoozeAlert":
      return `✓ Alerte repoussée jusqu'au ${format(new Date(data.due_at), "dd/MM/yyyy")}.`;

    case "createSubscription":
      return `✓ Abonnement créé avec l'ID : ${data.id}`;

    default:
      return "Action effectuée.";
  }
}
