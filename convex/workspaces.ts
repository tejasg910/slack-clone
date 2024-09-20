import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, arg) => {
    const joinCode = "1234";
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unathorized");
    }

    const workspaceId = await ctx.db.insert("workspaces", {
      joinCode,
      userId,
      name: arg.name,
    });
    return workspaceId;
  },
});
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workspaces").collect();
  },
});