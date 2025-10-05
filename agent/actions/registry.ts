import { z } from "zod";
import { type AgentAction } from "./types";
import { prisma } from "@/lib/db";

export const actions: AgentAction<any, any>[] = [
  {
    key: "listRenewals",
    roles: ["admin", "editor", "viewer"],
    input: z.object({ from: z.string(), to: z.string() }),
    output: z.object({
      items: z.array(
        z.object({
          id: z.string(),
          service_name: z.string(),
          next_renewal_date: z.string().optional(),
          cost_amount: z.number(),
          cost_currency: z.string(),
        })
      ),
    }),
    handler: async ({ from, to }, ctx) => {
      const subs = await prisma.subscription.findMany({
        where: {
          workspaceId: ctx.workspaceId,
          nextRenewalDate: {
            gte: new Date(from),
            lte: new Date(to),
          },
        },
        orderBy: { nextRenewalDate: "asc" },
      });

      return {
        items: subs.map((s) => ({
          id: s.id,
          service_name: s.serviceName,
          next_renewal_date: s.nextRenewalDate?.toISOString(),
          cost_amount: Number(s.costAmount),
          cost_currency: s.costCurrency,
        })),
      };
    },
  },
  {
    key: "markToCancel",
    roles: ["admin", "editor"],
    input: z.object({ id: z.string() }),
    output: z.object({ ok: z.boolean() }),
    handler: async ({ id }, ctx) => {
      await prisma.subscription.update({
        where: { id, workspaceId: ctx.workspaceId },
        data: { status: "TO_CANCEL" },
      });

      // Log event
      await prisma.event.create({
        data: {
          workspaceId: ctx.workspaceId,
          actorUserId: ctx.userId,
          action: "mark_to_cancel",
          entity: "subscription",
          entityId: id,
        },
      });

      return { ok: true };
    },
  },
  {
    key: "snoozeAlert",
    roles: ["admin", "editor"],
    input: z.object({
      alertId: z.string(),
      days: z.number().min(1).max(30).default(7),
    }),
    output: z.object({ ok: z.boolean(), due_at: z.string() }),
    handler: async ({ alertId, days }, ctx) => {
      const dueAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      // For demo, we'll just return success
      // In production, update the alert in DB
      return { ok: true, due_at: dueAt.toISOString() };
    },
  },
  {
    key: "createSubscription",
    roles: ["admin", "editor"],
    input: z.object({
      service_name: z.string(),
      plan: z.string().optional(),
      cost_amount: z.number(),
      cost_currency: z.string().default("EUR"),
      billing_period: z.enum(["monthly", "annual", "custom"]).default("monthly"),
      next_renewal_date: z.string().optional(),
      owner: z.string().optional(),
    }),
    output: z.object({ id: z.string() }),
    handler: async (input, ctx) => {
      const monthlyEq =
        input.billing_period === "annual"
          ? input.cost_amount / 12
          : input.cost_amount;

      const sub = await prisma.subscription.create({
        data: {
          workspaceId: ctx.workspaceId,
          serviceName: input.service_name,
          plan: input.plan,
          costAmount: input.cost_amount,
          costCurrency: input.cost_currency,
          billingPeriod: input.billing_period.toUpperCase() as any,
          monthlyEq,
          nextRenewalDate: input.next_renewal_date
            ? new Date(input.next_renewal_date)
            : null,
          owner: input.owner,
          status: "ACTIVE",
        },
      });

      await prisma.event.create({
        data: {
          workspaceId: ctx.workspaceId,
          actorUserId: ctx.userId,
          action: "create",
          entity: "subscription",
          entityId: sub.id,
        },
      });

      return { id: sub.id };
    },
  },
];

export const getAction = (k: string) => actions.find((a) => a.key === k);
