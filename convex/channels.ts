import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const remove = mutation({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, arg) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }



    const channel = await ctx.db.get(arg.id);
    if (!channel) {
      throw new Error("No channel found")
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }
    //Todo: delete associated message from the channel 
    await ctx.db.delete(arg.id)
    return arg.id;
  }
})

export const udpate = mutation({
  args: {
    id: v.id("channels"),
    name: v.string()
  },
  handler: async (ctx, arg) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }



    const channel = await ctx.db.get(arg.id);
    if (!channel) {
      throw new Error("No channel found")
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(arg.id, { name: arg.name })
    return arg.id;
  }
})
export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, arg) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", arg.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const parsedName = arg.name.replace(/s+/g, "-");
    const channelId = await ctx.db.insert("channels", {
      name: parsedName,
      workspaceId: arg.workspaceId,
    });
    return channelId;
  },
});

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, arg) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", arg.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) {
      return [];
    }

    const channels = ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", arg.workspaceId))
      .collect();

    return channels;
  },
});



export const getById = query({
  args: { id: v.id("channels") },
  handler: async (ctx, arg) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }


    const channel = await ctx.db.get(arg.id);
    if (!channel) {
      return null;
    }

    const member = await ctx.db.query("members").withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", channel.workspaceId).eq("userId", userId)).unique();


    if (!member) {
      return null;
    }
    return channel;
  }
})