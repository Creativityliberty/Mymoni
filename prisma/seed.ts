import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@subsensei.com" },
    update: {},
    create: {
      email: "demo@subsensei.com",
      name: "Demo User",
      role: "ADMIN",
    },
  });

  // Create demo workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: "ws_demo" },
    update: {},
    create: {
      id: "ws_demo",
      name: "Demo Workspace",
      currency: "EUR",
    },
  });

  // Link user to workspace
  await prisma.member.upsert({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: workspace.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      workspaceId: workspace.id,
      role: "ADMIN",
    },
  });

  // Create demo subscriptions
  const subscriptions = [
    {
      serviceName: "Netflix",
      vendor: "Netflix Inc.",
      category: "Streaming",
      plan: "Premium",
      status: "ACTIVE" as const,
      costAmount: 17.99,
      costCurrency: "EUR",
      billingPeriod: "MONTHLY" as const,
      monthlyEq: 17.99,
      nextRenewalDate: new Date("2025-10-15"),
      owner: "Isabel",
      tags: ["perso", "entertainment"],
    },
    {
      serviceName: "Shopify",
      vendor: "Shopify Inc.",
      category: "E-commerce",
      plan: "Basic",
      status: "TO_CANCEL" as const,
      costAmount: 29,
      costCurrency: "USD",
      billingPeriod: "MONTHLY" as const,
      monthlyEq: 29,
      nextRenewalDate: new Date("2025-10-10"),
      trialEndDate: new Date("2025-10-05"),
      owner: "Lionel",
      tags: ["projet", "business"],
    },
    {
      serviceName: "GitHub Pro",
      vendor: "GitHub",
      category: "Development",
      plan: "Pro",
      status: "ACTIVE" as const,
      costAmount: 48,
      costCurrency: "USD",
      billingPeriod: "ANNUAL" as const,
      monthlyEq: 4,
      startDate: new Date("2024-01-15"),
      nextRenewalDate: new Date("2026-01-15"),
      owner: "Tech Team",
      tags: ["dev", "tools"],
    },
    {
      serviceName: "Notion",
      vendor: "Notion Labs",
      category: "Productivity",
      plan: "Team",
      status: "ACTIVE" as const,
      costAmount: 96,
      costCurrency: "EUR",
      billingPeriod: "ANNUAL" as const,
      monthlyEq: 8,
      nextRenewalDate: new Date("2025-11-20"),
      owner: "Everyone",
      tags: ["productivity", "collaboration"],
    },
    {
      serviceName: "Figma",
      vendor: "Figma Inc.",
      category: "Design",
      plan: "Professional",
      status: "WATCH" as const,
      costAmount: 12,
      costCurrency: "USD",
      billingPeriod: "MONTHLY" as const,
      monthlyEq: 12,
      nextRenewalDate: new Date("2025-10-08"),
      owner: "Design Team",
      tags: ["design", "tools"],
      notes: "Vérifier l'utilisation avant renouvellement",
    },
    {
      serviceName: "Vercel Pro",
      vendor: "Vercel Inc.",
      category: "Hosting",
      plan: "Pro",
      status: "ACTIVE" as const,
      costAmount: 20,
      costCurrency: "USD",
      billingPeriod: "MONTHLY" as const,
      monthlyEq: 20,
      nextRenewalDate: new Date("2025-10-12"),
      owner: "Tech Team",
      tags: ["hosting", "infrastructure"],
    },
    {
      serviceName: "Slack",
      vendor: "Slack Technologies",
      category: "Communication",
      plan: "Standard",
      status: "ACTIVE" as const,
      costAmount: 6.67,
      costCurrency: "EUR",
      billingPeriod: "MONTHLY" as const,
      monthlyEq: 6.67,
      nextRenewalDate: new Date("2025-10-20"),
      owner: "Everyone",
      tags: ["communication", "team"],
    },
    {
      serviceName: "Linear",
      vendor: "Linear",
      category: "Project Management",
      plan: "Standard",
      status: "ACTIVE" as const,
      costAmount: 96,
      costCurrency: "USD",
      billingPeriod: "ANNUAL" as const,
      monthlyEq: 8,
      trialEndDate: new Date("2025-10-03"),
      nextRenewalDate: new Date("2026-02-15"),
      owner: "Product Team",
      tags: ["project-management", "tools"],
    },
    {
      serviceName: "OpenAI API",
      vendor: "OpenAI",
      category: "AI/ML",
      plan: "Pay-as-you-go",
      status: "ACTIVE" as const,
      costAmount: 50,
      costCurrency: "USD",
      billingPeriod: "MONTHLY" as const,
      monthlyEq: 50,
      owner: "Tech Team",
      tags: ["ai", "api"],
      notes: "Usage variable, surveiller les coûts",
    },
    {
      serviceName: "Adobe Creative Cloud",
      vendor: "Adobe",
      category: "Design",
      plan: "All Apps",
      status: "ACTIVE" as const,
      costAmount: 59.99,
      costCurrency: "EUR",
      billingPeriod: "MONTHLY" as const,
      monthlyEq: 59.99,
      nextRenewalDate: new Date("2025-10-25"),
      owner: "Design Team",
      tags: ["design", "creative"],
    },
  ];

  for (const sub of subscriptions) {
    await prisma.subscription.create({
      data: {
        ...sub,
        workspaceId: workspace.id,
      },
    });
  }

  // Create some alerts
  const subs = await prisma.subscription.findMany({
    where: { workspaceId: workspace.id },
  });

  for (const sub of subs) {
    if (sub.nextRenewalDate) {
      const daysUntil = Math.floor(
        (sub.nextRenewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntil <= 14) {
        await prisma.alert.create({
          data: {
            subscriptionId: sub.id,
            type: "RENEWAL",
            severity: daysUntil <= 3 ? "CRITICAL" : daysUntil <= 7 ? "WARNING" : "INFO",
            dueAt: sub.nextRenewalDate,
            payload: {
              daysUntil,
              amount: sub.costAmount.toString(),
              currency: sub.costCurrency,
            },
          },
        });
      }
    }

    if (sub.trialEndDate) {
      const daysUntil = Math.floor(
        (sub.trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntil <= 7) {
        await prisma.alert.create({
          data: {
            subscriptionId: sub.id,
            type: "TRIAL",
            severity: daysUntil <= 2 ? "CRITICAL" : "WARNING",
            dueAt: sub.trialEndDate,
            payload: {
              daysUntil,
              serviceName: sub.serviceName,
            },
          },
        });
      }
    }
  }

  console.log("✅ Seed completed!");
  console.log(`   User: ${user.email}`);
  console.log(`   Workspace: ${workspace.name}`);
  console.log(`   Subscriptions: ${subscriptions.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
