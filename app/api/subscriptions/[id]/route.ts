import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const workspaceId = "ws_demo"; // TODO: Get from session

  const s = await prisma.subscription.findUnique({
    where: { id: params.id, workspaceId },
  });

  if (!s) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: s.id,
    service_name: s.serviceName,
    vendor: s.vendor,
    category: s.category,
    plan: s.plan,
    status: s.status.toLowerCase(),
    cost_amount: Number(s.costAmount),
    cost_currency: s.costCurrency,
    billing_period: s.billingPeriod.toLowerCase(),
    monthly_eq: Number(s.monthlyEq),
    start_date: s.startDate?.toISOString(),
    next_renewal_date: s.nextRenewalDate?.toISOString(),
    trial_end_date: s.trialEndDate?.toISOString(),
    payment_hint: s.paymentHint,
    owner: s.owner,
    tags: s.tags,
    notes: s.notes,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const workspaceId = "ws_demo"; // TODO: Get from session

  const monthlyEq =
    body.billing_period === "annual"
      ? body.cost_amount / 12
      : body.cost_amount;

  await prisma.subscription.update({
    where: { id: params.id, workspaceId },
    data: {
      serviceName: body.service_name,
      vendor: body.vendor,
      category: body.category,
      plan: body.plan,
      status: (body.status || "active").toUpperCase(),
      costAmount: body.cost_amount,
      costCurrency: body.cost_currency || "EUR",
      billingPeriod: (body.billing_period || "monthly").toUpperCase(),
      monthlyEq,
      nextRenewalDate: body.next_renewal_date
        ? new Date(body.next_renewal_date)
        : null,
      trialEndDate: body.trial_end_date ? new Date(body.trial_end_date) : null,
      owner: body.owner,
      tags: body.tags || [],
      notes: body.notes,
    },
  });

  // Log event
  await prisma.event.create({
    data: {
      workspaceId,
      actorUserId: "u_demo", // TODO: Get from session
      action: "update",
      entity: "subscription",
      entityId: params.id,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const workspaceId = "ws_demo"; // TODO: Get from session

  await prisma.subscription.delete({
    where: { id: params.id, workspaceId },
  });

  // Log event
  await prisma.event.create({
    data: {
      workspaceId,
      actorUserId: "u_demo", // TODO: Get from session
      action: "delete",
      entity: "subscription",
      entityId: params.id,
    },
  });

  return NextResponse.json({ ok: true });
}
