"use client";

import { MoreHorizontal, Edit3, BellOff, XCircle, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function RowActions({ sub }: { sub: { id: string; service_name: string } }) {
  const [busy, setBusy] = useState<string | false>(false);

  async function call(tool: { key: string; input: any }) {
    setBusy(tool.key);
    try {
      await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, messages: [] }),
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={!!busy}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("open-edit-subscription", { detail: { id: sub.id } })
            )
          }
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Éditer
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            call({ key: "snoozeAlert", input: { alertId: `al_${sub.id}`, days: 7 } })
          }
        >
          <BellOff className="mr-2 h-4 w-4" />
          Snoozer 7j
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => call({ key: "markToCancel", input: { id: sub.id } })}
        >
          <XCircle className="mr-2 h-4 w-4" />
          À annuler
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("open-attach-invoice", { detail: { id: sub.id } })
            )
          }
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Ajouter facture
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
