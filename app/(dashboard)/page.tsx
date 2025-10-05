import { prisma } from "@/lib/db";
import { TrendingUp, AlertTriangle, Clock } from "lucide-react";

async function getDashboardStats() {
  const workspaceId = "ws_demo"; // TODO: Get from session

  const [totalSubs, activeAlerts, upcomingRenewals, totalMonthly] =
    await Promise.all([
      prisma.subscription.count({ where: { workspaceId } }),
      prisma.alert.count({
        where: {
          subscription: { workspaceId },
          resolvedAt: null,
        },
      }),
      prisma.subscription.count({
        where: {
          workspaceId,
          nextRenewalDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.subscription.aggregate({
        where: { workspaceId, status: "ACTIVE" },
        _sum: { monthlyEq: true },
      }),
    ]);

  return {
    totalSubs,
    activeAlerts,
    upcomingRenewals,
    totalMonthly: totalMonthly._sum.monthlyEq || 0,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de vos abonnements
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total mensuel</p>
              <p className="text-2xl font-bold">
                {Number(stats.totalMonthly).toFixed(2)} €
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalSubs} abonnements actifs
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-amber-500/10 p-3">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Renouvellements &lt; 14j
              </p>
              <p className="text-2xl font-bold">{stats.upcomingRenewals}</p>
              <p className="text-xs text-muted-foreground mt-1">
                À surveiller
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-rose-500/10 p-3">
              <AlertTriangle className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Alertes actives</p>
              <p className="text-2xl font-bold">{stats.activeAlerts}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Nécessitent attention
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <a
            href="/subscriptions"
            className="flex items-center gap-3 rounded-xl border p-4 hover:bg-accent transition-colors"
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Voir les renouvellements</p>
              <p className="text-sm text-muted-foreground">
                Prochains 14 jours
              </p>
            </div>
          </a>
          <a
            href="/alerts"
            className="flex items-center gap-3 rounded-xl border p-4 hover:bg-accent transition-colors"
          >
            <div className="rounded-lg bg-amber-500/10 p-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">Gérer les alertes</p>
              <p className="text-sm text-muted-foreground">
                {stats.activeAlerts} en attente
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
