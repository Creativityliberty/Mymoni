export async function detectIntent(
  messages: { role: "user" | "assistant"; content: string }[]
) {
  const last = messages.at(-1)?.content ?? "";

  // Renouvellements
  if (/renouvel|échéance|expire|renouvelle/i.test(last)) {
    const from = new Date();
    const to = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return {
      actionKey: "listRenewals",
      input: { from: from.toISOString(), to: to.toISOString() },
    } as const;
  }

  // Annulation
  if (/annul|cancel|supprimer|arrêter/i.test(last)) {
    // TODO: Extract subscription ID or name from message
    return { actionKey: "markToCancel", input: { id: "demo_id" } } as const;
  }

  // Snooze
  if (/snooze|repouss|rappel|plus tard/i.test(last)) {
    return {
      actionKey: "snoozeAlert",
      input: { alertId: "al_001", days: 7 },
    } as const;
  }

  // Création
  if (/créer|ajouter|nouveau|nouvelle/i.test(last)) {
    return {
      actionKey: "createSubscription",
      input: {
        service_name: "Nouveau service",
        cost_amount: 0,
        billing_period: "monthly" as const,
      },
    } as const;
  }

  return null;
}
