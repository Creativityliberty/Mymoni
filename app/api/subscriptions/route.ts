import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function parseQuery(req: NextRequest) {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("pageSize") || "20"))
  );
  const q = url.searchParams.get("q") || "";
  const status = url.searchParams.get("status") || undefined;
  const owner = url.searchParams.get("owner") || undefined;
  const minMonthlyEq = url.searchParams.get("minMonthlyEq");
  const renewalFrom = url.searchParams.get("renewalFrom");
  const renewalTo = url.searchParams.get("renewalTo");
  const sort = url.searchParams.get("sortBy") || "nextRenewalDate";
  const order = (url.searchParams.get("order") || "asc") as "asc" | "desc";
  return {
    page,
    pageSize,
    q,
    status,
    owner,
    minMonthlyEq: minMonthlyEq ? Number(minMonthlyEq) : undefined,
    renewalFrom,
    renewalTo,
    sort,
    order,
  };
}

export async function GET(req: NextRequest) {
  const {
    page,
    pageSize,
    q,
    status,
    owner,
    minMonthlyEq,
    renewalFrom,
    renewalTo,
    sort,
    order,
  } = parseQuery(req);

  const workspaceId = "ws_demo"; // TODO: Get from session

  const where: any = { workspaceId };

  if (q) {
    where.OR = [
      { serviceName: { contains: q, mode: "insensitive" } },
      { vendor: { contains: q, mode: "insensitive" } },
      { notes: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status.toUpperCase();
  if (owner) where.owner = owner;
  if (minMonthlyEq) where.monthlyEq = { gte: minMonthlyEq };
  if (renewalFrom || renewalTo) {
    where.nextRenewalDate = {
      gte: renewalFrom ? new Date(renewalFrom) : undefined,
      lte: renewalTo ? new Date(renewalTo) : undefined,
    };
  }

  const [items, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.subscription.count({ where }),
  ]);

  const mapped = items.map((s) => ({
    id: s.id,
    service_name: s.serviceName,
    plan: s.plan ?? undefined,
    status: s.status.toLowerCase(),
    cost_amount: Number(s.costAmount),
    cost_currency: s.costCurrency,
    billing_period: s.billingPeriod.toLowerCase(),
    monthly_eq: Number(s.monthlyEq),
    next_renewal_date: s.nextRenewalDate?.toISOString(),
    trial_end_date: s.trialEndDate?.toISOString(),
    owner: s.owner ?? undefined,
    tags: (s.tags as any) ?? [],
    notes: s.notes ?? undefined,
  }));

  return NextResponse.json({ items: mapped, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const workspaceId = "ws_demo"; // TODO: Get from session

  const monthlyEq =
    body.billing_period === "annual"
      ? body.cost_amount / 12
      : body.cost_amount;

  const s = await prisma.subscription.create({
    data: {
      workspaceId,
      serviceName: body.service_name,
      vendor: body.vendor,
      category: body.category,
      plan: body.plan,
      status: (body.status || "active").toUpperCase(),
      costAmount: body.cost_amount,
      costCurrency: body.cost_currency || "EUR",
      billingPeriod: (body.billing_period || "monthly").toUpperCase(),
      monthlyEq,
      startDate: body.start_date ? new Date(body.start_date) : null,
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
      action: "create",
      entity: "subscription",
      entityId: s.id,
      payload: { service_name: s.serviceName },
    },
  });

  return NextResponse.json({ id: s.id }, { status: 201 });
}
