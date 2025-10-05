"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ListChecks, Bell, Receipt, Settings, Bot } from "lucide-react";

const items = [
  { href: "/", label: "Tableau de bord", icon: LayoutGrid },
  { href: "/subscriptions", label: "Abonnements", icon: ListChecks },
  { href: "/alerts", label: "Alertes", icon: Bell },
  { href: "/invoices", label: "Factures", icon: Receipt },
  { href: "/settings", label: "Réglages", icon: Settings },
  { href: "/agent", label: "Agent", icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-r bg-card/40 backdrop-blur-sm">
      <div className="p-4 font-bold text-lg border-b">
        <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          SubSensei
        </span>
      </div>
      <nav className="px-2 py-4 space-y-1">
        {items.map((it) => {
          const active =
            pathname === it.href || pathname.startsWith(it.href + "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 px-4 py-4 text-xs text-muted-foreground border-t">
        © {new Date().getFullYear()} Mymoni
      </div>
    </aside>
  );
}
