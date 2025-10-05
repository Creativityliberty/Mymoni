"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { RowActions } from "./row-actions";
import { ServiceLogo } from "@/components/service-logo";

export type Subscription = {
  id: string;
  service_name: string;
  plan?: string;
  status: "active" | "watch" | "to_cancel";
  cost_amount: number;
  cost_currency: string;
  billing_period: "monthly" | "annual" | "custom";
  monthly_eq: number;
  next_renewal_date?: string;
  trial_end_date?: string;
  owner?: string;
  tags?: string[];
};

const statusColor: Record<Subscription["status"], string> = {
  active: "bg-emerald-600",
  watch: "bg-amber-600",
  to_cancel: "bg-rose-600",
};

const statusLabel: Record<Subscription["status"], string> = {
  active: "Actif",
  watch: "Surveillance",
  to_cancel: "À annuler",
};

export const columns: ColumnDef<Subscription>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "service_name",
    header: "Service",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <ServiceLogo serviceName={row.original.service_name} size="md" />
        <div>
          <p className="font-semibold">{row.original.service_name}</p>
          {row.original.plan && (
            <p className="text-xs text-muted-foreground">{row.original.plan}</p>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.original.status;
      const config = {
        active: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
        watch: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
        to_cancel: { bg: "bg-rose-50 dark:bg-rose-950", text: "text-rose-700 dark:text-rose-400", dot: "bg-rose-500" },
      }[status];
      
      return (
        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${config.bg}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
          <span className={`text-xs font-medium ${config.text}`}>{statusLabel[row.original.status]}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "monthly_eq",
    header: "€/mois",
    cell: ({ row }) => (
      <div className="font-mono">
        <span className="font-semibold text-base">
          {row.original.monthly_eq.toFixed(2)}
        </span>
        <span className="text-muted-foreground ml-1">€</span>
      </div>
    ),
  },
  {
    accessorKey: "cost_amount",
    header: "Montant",
    cell: ({ row }) => (
      <div className="text-sm">
        <span className="font-medium">{row.original.cost_amount.toFixed(2)} {row.original.cost_currency}</span>
        <span className="text-muted-foreground">
          {row.original.billing_period === "annual" ? " /an" : " /mois"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "next_renewal_date",
    header: "Prochaine échéance",
    cell: ({ row }) => {
      if (!row.original.next_renewal_date) {
        return <span className="text-muted-foreground">—</span>;
      }
      const date = new Date(row.original.next_renewal_date);
      const daysUntil = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const isUrgent = daysUntil <= 7;
      
      return (
        <div className="text-sm">
          <p className={isUrgent ? "font-medium text-amber-600" : ""}>
            {format(date, "dd/MM/yyyy")}
          </p>
          {isUrgent && daysUntil > 0 && (
            <p className="text-xs text-amber-600">Dans {daysUntil}j</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "trial_end_date",
    header: "Fin d'essai",
    cell: ({ row }) => {
      if (!row.original.trial_end_date) {
        return <span className="text-muted-foreground">—</span>;
      }
      const date = new Date(row.original.trial_end_date);
      const daysUntil = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const isPast = daysUntil < 0;
      
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
          isPast ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400" : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
        }`}>
          <span>{format(date, "dd/MM/yyyy")}</span>
          {!isPast && daysUntil <= 7 && <span>({daysUntil}j)</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "owner",
    header: "Propriétaire",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.owner ?? "—"}</span>
    ),
  },
  {
    id: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {(row.original.tags ?? []).slice(0, 2).map((t) => (
          <Badge key={t} variant="secondary" className="text-xs px-2 py-0.5">
            {t}
          </Badge>
        ))}
        {(row.original.tags ?? []).length > 2 && (
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            +{(row.original.tags ?? []).length - 2}
          </Badge>
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions sub={row.original} />,
  },
];
