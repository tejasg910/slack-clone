import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";
const generateCode = () => {
  const code = Array.from({ length: 7 }, () => {
    return "0123456789abcdefghijklmnopqrstuvwxyz"[
      Math.floor(Math.random() * 36)
    ];
  }).join("");
  return code;
};

export const join = mutation({
  args: { joinCode: v.string(), workspaceId: v.id("workspaces") },
  handler: async (ctx, arg) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unathorized");
    }

    const worksapce = await ctx.db.get(arg.workspaceId);
    if (!worksapce) {
      throw new Error("workspace not found");
    }

    if (worksapce.joinCode !== arg.joinCode.toLowerCase()) {
      throw new Error("Invalid join code");
    }

    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", arg.workspaceId).eq("userId", userId)
      )
      .unique();

    if (existingMember) {
      throw new Error("Member already exists in this workspace");
    }

    await ctx.db.insert("members", {
      userId,
      role: "member",
      workspaceId: arg.workspaceId,
    });
  },
});

export const newJoinCode = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, arg) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unathorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", arg.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) {
      throw new Error("Unathorized");
    }

    const joinCode = generateCode();
    await ctx.db.patch(arg.workspaceId, { joinCode });
    return arg.workspaceId;
  },
});
export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, arg) => {
    const joinCode = generateCode();
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unathorized");
    }

    const workspaceId = await ctx.db.insert("workspaces", {
      joinCode,
      userId,
      name: arg.name,
    });

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    await ctx.db.insert("channels", {
      name: "General",
      workspaceId,
    });
    return workspaceId;
  },
});
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaces = [];
    const workSpaceIds = members.map((member) => member.workspaceId);
    for (const workspaceId of workSpaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        workspaces.push(workspace);
      }
    }
    return workspaces;
  },
});

export const getInfoById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, arg) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", arg.id).eq("userId", userId)
      )
      .unique();

    const workspace = await ctx.db.get(arg.id);
    return { name: workspace?.name, isMember: !!member };
  },
});
export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, arg) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unathorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", arg.id).eq("userId", userId)
      )
      .unique();

    if (!member) {
      return null;
    }

    return await ctx.db.get(arg.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, arg) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unathorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", arg.id).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unathorized");
    }

    await ctx.db.patch(arg.id, {
      name: arg.name,
    });

    return arg.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, arg) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unathorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", arg.id).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unathorized");
    }

    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", arg.id)
        )
        .collect(),
    ]);

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    await ctx.db.delete(arg.id);

    return arg.id;
  },
});
