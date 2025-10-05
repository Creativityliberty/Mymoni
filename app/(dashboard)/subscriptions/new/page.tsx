import { SubscriptionForm } from "@/features/subscriptions/forms/subscription-form";

export default function NewSubscriptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouvel abonnement</h1>
        <p className="text-muted-foreground">
          Ajoutez un nouvel abonnement à votre workspace
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <SubscriptionForm />
      </div>
    </div>
  );
}
