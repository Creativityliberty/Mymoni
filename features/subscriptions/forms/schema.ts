import { z } from "zod";

export const subscriptionSchema = z.object({
  service_name: z.string().min(2, "Le nom du service est requis"),
  vendor: z.string().optional(),
  category: z.string().optional(),
  plan: z.string().optional(),
  status: z.enum(["active", "watch", "to_cancel"]).default("active"),
  cost_amount: z.coerce.number().positive("Le montant doit être positif"),
  cost_currency: z.string().default("EUR"),
  billing_period: z
    .enum(["monthly", "annual", "custom"])
    .default("monthly"),
  start_date: z.string().optional(),
  next_renewal_date: z.string().optional(),
  trial_end_date: z.string().optional(),
  payment_hint: z.string().optional(),
  owner: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
