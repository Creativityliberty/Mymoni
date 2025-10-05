import { z } from "zod";

export type AgentContext = {
  userId: string;
  workspaceId: string;
  role: "admin" | "editor" | "viewer";
};

export type AgentAction<I, O> = {
  key: string;
  input: z.ZodType<I>;
  output: z.ZodType<O>;
  roles: AgentContext["role"][];
  handler: (input: I, ctx: AgentContext) => Promise<O>;
};
