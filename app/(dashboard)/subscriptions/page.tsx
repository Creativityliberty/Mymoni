import { SubscriptionTable } from "@/features/subscriptions/table/subscription-table";
import { columns, type Subscription } from "@/features/subscriptions/table/columns";
import { prisma } from "@/lib/db";

async function getSubscriptions(): Promise<Subscription[]> {
  const workspaceId = "ws_demo"; // TODO: Get from session

  const subs = await prisma.subscription.findMany({
    where: { workspaceId },
    orderBy: { nextRenewalDate: "asc" },
  });

  return subs.map((s) => ({
    id: s.id,
    service_name: s.serviceName,
    plan: s.plan ?? undefined,
    status: s.status.toLowerCase() as "active" | "watch" | "to_cancel",
    cost_amount: Number(s.costAmount),
    cost_currency: s.costCurrency,
    billing_period: s.billingPeriod.toLowerCase() as "monthly" | "annual" | "custom",
    monthly_eq: Number(s.monthlyEq),
    next_renewal_date: s.nextRenewalDate?.toISOString(),
    trial_end_date: s.trialEndDate?.toISOString(),
    owner: s.owner ?? undefined,
    tags: (s.tags as string[]) ?? [],
  }));
}

export default async function SubscriptionsPage() {
  const data = await getSubscriptions();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Abonnements</h1>
        <p className="text-muted-foreground">
          Gérez tous vos abonnements en un seul endroit
        </p>
      </div>
      <SubscriptionTable data={data} columns={columns} />
    </div>
  );
}
