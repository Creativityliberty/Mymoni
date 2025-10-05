import { llm } from "@/lib/ai/providers";

export async function classifyIntent(prompt: string) {
  const sys = `Tu es un routeur d'intentions pour une app de gestion d'abonnements.
Analyse la requête utilisateur et réponds UNIQUEMENT par une ligne au format:
<action_key> <json_input>

Actions disponibles:
- listRenewals {"from":"YYYY-MM-DD","to":"YYYY-MM-DD"}
- markToCancel {"id":"subscription_id"}
- snoozeAlert {"alertId":"alert_id","days":7}
- createSubscription {"service_name":"nom","cost_amount":X,"billing_period":"monthly|annual"}

Exemples:
"Quels sont mes renouvellements cette semaine ?" → listRenewals {"from":"2025-10-05","to":"2025-10-12"}
"Marque Netflix à annuler" → markToCancel {"id":"netflix_id"}
"Repousse l'alerte de 7 jours" → snoozeAlert {"alertId":"al_001","days":7}`;

  try {
    const { text } = await llm({
      messages: [
        { role: "system", content: sys },
        { role: "user", content: prompt },
      ],
    });
    return text;
  } catch (error) {
    console.error("LLM classification error:", error);
    return null;
  }
}

export async function enhanceAgentReply(
  action: string,
  result: any,
  userQuery: string
): Promise<string> {
  const sys = `Tu es Mymoni, un assistant IA pour la gestion d'abonnements.
Génère une réponse naturelle et concise basée sur l'action effectuée et son résultat.
Sois amical, professionnel et précis.`;

  const prompt = `Action: ${action}
Résultat: ${JSON.stringify(result)}
Question utilisateur: ${userQuery}

Génère une réponse en français:`;

  try {
    const { text } = await llm({
      messages: [
        { role: "system", content: sys },
        { role: "user", content: prompt },
      ],
    });
    return text;
  } catch (error) {
    console.error("LLM reply enhancement error:", error);
    return "Action effectuée avec succès.";
  }
}
