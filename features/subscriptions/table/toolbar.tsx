"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Columns, Plus } from "lucide-react";
import Link from "next/link";

export function DataTableToolbar<T>({ table }: { table: Table<T> }) {
  const globalFilter = (table.getState() as any).globalFilter ?? "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Rechercher un service…"
        value={globalFilter}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="w-64"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Columns className="mr-2 h-4 w-4" />
            Colonnes
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {table
            .getAllLeafColumns()
            .filter((c) => c.getCanHide())
            .map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(v) => col.toggleVisibility(!!v)}
              >
                {col.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
      <div className="ml-auto">
        <Link href="/subscriptions/new">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel abonnement
          </Button>
        </Link>
      </div>
    </div>
  );
}
