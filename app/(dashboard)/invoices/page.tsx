import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Receipt, Download, Upload, FileText, Calendar } from "lucide-react";

async function getInvoices() {
  const workspaceId = "ws_demo"; // TODO: Get from session

  const invoices = await prisma.invoice.findMany({
    where: {
      subscription: { workspaceId },
    },
    include: {
      subscription: true,
    },
    orderBy: {
      issuedAt: "desc",
    },
  });

  return invoices;
}

async function getInvoiceStats() {
  const workspaceId = "ws_demo";

  const [totalInvoices, totalAmount, thisMonth] = await Promise.all([
    prisma.invoice.count({
      where: { subscription: { workspaceId } },
    }),
    prisma.invoice.aggregate({
      where: { subscription: { workspaceId } },
      _sum: { amount: true },
    }),
    prisma.invoice.count({
      where: {
        subscription: { workspaceId },
        issuedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  return {
    totalInvoices,
    totalAmount: totalAmount._sum.amount || 0,
    thisMonth,
  };
}

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  const stats = await getInvoiceStats();

  // Group by month
  const invoicesByMonth = invoices.reduce((acc, inv) => {
    if (!inv.issuedAt) return acc;
    const monthKey = format(inv.issuedAt, "MMMM yyyy", { locale: fr });
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(inv);
    return acc;
  }, {} as Record<string, typeof invoices>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Factures</h1>
          <p className="text-muted-foreground">
            Centralisez toutes vos factures d'abonnements
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Importer une facture
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total factures</p>
              <p className="text-2xl font-bold">{stats.totalInvoices}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Montant total</p>
              <p className="text-2xl font-bold">
                {Number(stats.totalAmount).toFixed(2)} €
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ce mois-ci</p>
              <p className="text-2xl font-bold">{stats.thisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      {invoices.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center">
          <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">Aucune facture</h3>
          <p className="text-muted-foreground mb-4">
            Commencez par importer vos premières factures
          </p>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Importer une facture
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(invoicesByMonth).map(([month, monthInvoices]) => (
            <div key={month} className="space-y-3">
              <h2 className="text-lg font-semibold capitalize">{month}</h2>
              <div className="space-y-2">
                {monthInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="rounded-2xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-primary/10 p-3">
                          <Receipt className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">
                              {invoice.subscription.serviceName}
                            </h3>
                            {invoice.subscription.plan && (
                              <Badge variant="secondary" className="text-xs">
                                {invoice.subscription.plan}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            {invoice.issuedAt && (
                              <span>
                                Émise le{" "}
                                {format(invoice.issuedAt, "dd MMM yyyy", {
                                  locale: fr,
                                })}
                              </span>
                            )}
                            {invoice.periodStart && invoice.periodEnd && (
                              <span>
                                • Période :{" "}
                                {format(invoice.periodStart, "dd/MM", {
                                  locale: fr,
                                })}{" "}
                                -{" "}
                                {format(invoice.periodEnd, "dd/MM/yyyy", {
                                  locale: fr,
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {Number(invoice.amount).toFixed(2)} {invoice.currency}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
