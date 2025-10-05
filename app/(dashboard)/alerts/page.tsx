import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle, Clock, TrendingUp, CreditCard, CheckCircle, XCircle } from "lucide-react";

async function getAlerts() {
  const workspaceId = "ws_demo"; // TODO: Get from session

  const alerts = await prisma.alert.findMany({
    where: {
      subscription: { workspaceId },
    },
    include: {
      subscription: true,
    },
    orderBy: [
      { resolvedAt: "asc" },
      { severity: "desc" },
      { dueAt: "asc" },
    ],
  });

  return alerts;
}

const severityConfig = {
  INFO: { color: "bg-blue-500", label: "Info", icon: Clock },
  WARNING: { color: "bg-amber-500", label: "Attention", icon: AlertTriangle },
  CRITICAL: { color: "bg-rose-500", label: "Critique", icon: XCircle },
};

const typeConfig = {
  RENEWAL: { label: "Renouvellement", icon: Clock },
  TRIAL: { label: "Fin d'essai", icon: TrendingUp },
  SPIKE: { label: "Pic de coût", icon: TrendingUp },
  CARD_EXPIRY: { label: "Carte expire", icon: CreditCard },
};

export default async function AlertsPage() {
  const alerts = await getAlerts();
  const activeAlerts = alerts.filter((a) => !a.resolvedAt);
  const resolvedAlerts = alerts.filter((a) => a.resolvedAt);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alertes</h1>
        <p className="text-muted-foreground">
          Gérez les notifications et rappels de vos abonnements
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-500/10 p-2">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critiques</p>
              <p className="text-2xl font-bold">
                {activeAlerts.filter((a) => a.severity === "CRITICAL").length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-2">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold">{activeAlerts.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Résolues</p>
              <p className="text-2xl font-bold">{resolvedAlerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Alertes actives</h2>
        {activeAlerts.length === 0 ? (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
            <p className="text-muted-foreground">Aucune alerte active 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map((alert) => {
              const SeverityIcon = severityConfig[alert.severity].icon;
              const TypeIcon = typeConfig[alert.type].icon;
              const daysUntil = Math.ceil(
                (alert.dueAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={alert.id}
                  className="rounded-2xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-xl ${severityConfig[alert.severity].color}/10 p-3`}
                    >
                      <SeverityIcon
                        className={`h-5 w-5 ${severityConfig[alert.severity].color.replace("bg-", "text-")}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">
                              {alert.subscription.serviceName}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              <TypeIcon className="h-3 w-3 mr-1" />
                              {typeConfig[alert.type].label}
                            </Badge>
                            <Badge
                              variant={
                                alert.severity === "CRITICAL"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {severityConfig[alert.severity].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {alert.type === "RENEWAL" &&
                              `Renouvellement dans ${daysUntil} jour${daysUntil > 1 ? "s" : ""} - ${Number(alert.subscription.costAmount).toFixed(2)} ${alert.subscription.costCurrency}`}
                            {alert.type === "TRIAL" &&
                              `Fin d'essai dans ${daysUntil} jour${daysUntil > 1 ? "s" : ""}`}
                            {alert.type === "SPIKE" && "Augmentation inhabituelle détectée"}
                            {alert.type === "CARD_EXPIRY" && "Carte bancaire expire bientôt"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Échéance : {format(alert.dueAt, "dd MMMM yyyy", { locale: fr })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Snoozer 7j
                          </Button>
                          <Button variant="outline" size="sm">
                            Résoudre
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-muted-foreground">
            Alertes résolues ({resolvedAlerts.length})
          </h2>
          <div className="space-y-2">
            {resolvedAlerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl border bg-muted/30 p-3 text-sm opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium">
                      {alert.subscription.serviceName}
                    </span>
                    <span className="text-muted-foreground">
                      - {typeConfig[alert.type].label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Résolu le {format(alert.resolvedAt!, "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
