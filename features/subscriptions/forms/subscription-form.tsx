"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscriptionSchema, type SubscriptionInput } from "./schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function SubscriptionForm({
  id,
  onSaved,
}: {
  id?: string;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<SubscriptionInput>({
    service_name: "",
    cost_amount: 0,
    cost_currency: "EUR",
    billing_period: "monthly",
    status: "active",
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const r = await fetch(`/api/subscriptions/${id}`);
      const d = await r.json();
      setValues({
        service_name: d.service_name,
        vendor: d.vendor ?? "",
        category: d.category ?? "",
        plan: d.plan ?? "",
        status: d.status,
        cost_amount: d.cost_amount,
        cost_currency: d.cost_currency,
        billing_period: d.billing_period,
        start_date: d.start_date?.split("T")[0] ?? "",
        next_renewal_date: d.next_renewal_date?.split("T")[0] ?? "",
        trial_end_date: d.trial_end_date?.split("T")[0] ?? "",
        payment_hint: d.payment_hint ?? "",
        owner: d.owner ?? "",
        tags: d.tags ?? [],
        notes: d.notes ?? "",
      });
    })();
  }, [id]);

  async function save() {
    setError(null);
    const parsed = subscriptionSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join(", "));
      return;
    }
    setLoading(true);

    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/subscriptions/${id}` : "/api/subscriptions";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'enregistrement");
      }

      if (onSaved) {
        onSaved();
      } else {
        router.push("/subscriptions");
        router.refresh();
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function addTag() {
    if (!tagInput.trim()) return;
    setValues((v) => ({
      ...v,
      tags: [...(v.tags || []), tagInput.trim()],
    }));
    setTagInput("");
  }

  function removeTag(tag: string) {
    setValues((v) => ({
      ...v,
      tags: (v.tags || []).filter((t) => t !== tag),
    }));
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-rose-500 bg-rose-500/10 p-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Service <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="Ex: Netflix, Shopify..."
            value={values.service_name}
            onChange={(e) =>
              setValues((v) => ({ ...v, service_name: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Fournisseur</label>
          <Input
            placeholder="Ex: Netflix Inc."
            value={values.vendor ?? ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, vendor: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Catégorie</label>
          <Input
            placeholder="Ex: Streaming, SaaS..."
            value={values.category ?? ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, category: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Plan</label>
          <Input
            placeholder="Ex: Premium, Pro..."
            value={values.plan ?? ""}
            onChange={(e) => setValues((v) => ({ ...v, plan: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Montant <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={values.cost_amount}
            onChange={(e) =>
              setValues((v) => ({ ...v, cost_amount: +e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Devise</label>
          <select
            value={values.cost_currency}
            onChange={(e) =>
              setValues((v) => ({ ...v, cost_currency: e.target.value }))
            }
            className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CHF">CHF (Fr.)</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Période de facturation
          </label>
          <select
            value={values.billing_period}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                billing_period: e.target.value as any,
              }))
            }
            className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="monthly">Mensuel</option>
            <option value="annual">Annuel</option>
            <option value="custom">Personnalisé</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Statut</label>
          <select
            value={values.status}
            onChange={(e) =>
              setValues((v) => ({ ...v, status: e.target.value as any }))
            }
            className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="active">Actif</option>
            <option value="watch">Surveillance</option>
            <option value="to_cancel">À annuler</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Date de début</label>
          <Input
            type="date"
            value={values.start_date ?? ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, start_date: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Prochaine échéance
          </label>
          <Input
            type="date"
            value={values.next_renewal_date ?? ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, next_renewal_date: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Fin d'essai</label>
          <Input
            type="date"
            value={values.trial_end_date ?? ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, trial_end_date: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Propriétaire</label>
          <Input
            placeholder="Ex: Équipe Marketing"
            value={values.owner ?? ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, owner: e.target.value }))
            }
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Indice de paiement
        </label>
        <Input
          placeholder="Ex: Carte ****1234"
          value={values.payment_hint ?? ""}
          onChange={(e) =>
            setValues((v) => ({ ...v, payment_hint: e.target.value }))
          }
        />
        <p className="text-xs text-muted-foreground mt-1">
          Ne stockez jamais les numéros de carte complets
        </p>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Tags</label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Ajouter un tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            Ajouter
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(values.tags || []).map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Notes</label>
        <textarea
          placeholder="Notes ou commentaires..."
          value={values.notes ?? ""}
          onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
          className="flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button onClick={save} disabled={loading}>
          {loading ? "Enregistrement..." : id ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </div>
  );
}
