import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";



const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
    return ctx.db.get(userId)
}


const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
    return ctx.db.get(memberId);
}


const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
    const messages = await ctx.db.query("messages").withIndex("by_parent_message_id", (q) => {
        return q.eq("parentMessageId", messageId)
    }).collect();


    if (messages.length === 0) {
        return { count: 0, image: undefined, timestamp: 0 }
    }

    const lastMessage = messages[messages.length - 1];
    const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

    if (!lastMessageMember) {
        return { count: 0, image: undefined, timestamp: 0 }
    }

    const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);
    return {
        count: messages.length,
        image: lastMessageUser?.image,
        timestamp: lastMessage._creationTime,
    }
}

const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
    return ctx.db.query("reactions").withIndex("by_message_id", (q) => q.eq("messageId", messageId)).collect();
}
const getMember = (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
    return ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
        .unique();
}

export const get = query({
    args: {
        channelId: v.optional(v.id("channels")),
        conversationId: v.optional(v.id("conversations")),
        parentMessageId: v.optional(v.id("messages")),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }
        let _conversationId = args.conversationId;

        if (!args.conversationId && !args.channelId && args.parentMessageId) {

            const parentMessage = await ctx.db.get(args.parentMessageId);

            if (!parentMessage) {
                throw new Error("Parent message not found");


            }

            _conversationId = parentMessage.conversationId;

        }

        const results = await ctx.db.query("messages").withIndex("by_channel_id_parent_message_id_conversation_id", (q) => {
            return q.eq("channelId", args.channelId).eq("parentMessageId", args.parentMessageId).eq("conversationId", _conversationId)
        }).order("desc").paginate(args.paginationOpts);




        return {
            ...results,
            page: (
                await Promise.all(results.page.map(async (message) => {

                    const member = await populateMember(ctx, message.memberId);
                    const user = member ? await populateUser(ctx, member.userId) : null;


                    if (!member || !user) {
                        return null;
                    }

                    const reactions = await populateReactions(ctx, message._id);

                    const thread = await populateThread(ctx, message._id);

                    const image = message.image ? await ctx.storage.getUrl(message.image) : undefined;


                    const reactCounts = reactions.map((reaction) => {
                        return { ...reaction, count: reactions.filter((r) => r.value === reaction.value).length }
                    })

                    const dedupedReactions = reactCounts.reduce((acc, reaction) => {
                        const existingReaction = acc.find((r) => r.value === reaction.value);

                        if (existingReaction) {
                            existingReaction.memberIds = Array.from(new Set([...existingReaction.memberIds, reaction.memberId]));
                        }
                        else {
                            acc.push({ ...reaction, memberIds: [reaction.memberId] })
                        }

                        return acc;
                    }, [] as (Doc<"reactions"> & { count: number; memberIds: Id<"members">[] })[]
                    )



                    const reactionsWithoutmemberProperty = dedupedReactions.map(({ memberId, ...rest }) => rest)

                    return { ...message, image, member, user, reactions: reactionsWithoutmemberProperty, threadCount: thread.count, threadImage: thread.image, threadTimestamp: thread.timestamp }
                })
                )

            )

                .filter((message): message is NonNullable<typeof message> => message !== null)

        };
    }
})

export const remove = mutation({
    args: { id: v.id("messages") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const message = await ctx.db.get(args.id);
        if (!message) {
            throw new Error("Message not found");
        }
        const member = await getMember(ctx, message.workspaceId, userId);
        if (!member) {
            throw new Error("Unauthorized");
        }
        if (message.memberId !== member._id) {
            throw new Error("Unauthorized");
        }
        await ctx.db.delete(args.id);
        return args.id;
    }
})

export const update = mutation({
    args: { id: v.id("messages"), body: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const message = await ctx.db.get(args.id);
        if (!message) {
            throw new Error("Message not found");
        }
        const member = await getMember(ctx, message.workspaceId, userId);
        if (!member) {
            throw new Error("Unauthorized");
        }
        if (message.memberId !== member._id) {
            throw new Error("Unauthorized");
        }
        await ctx.db.patch(args.id, {
            body: args.body,
            updatedAt: Date.now()
        });
        return args.id;
    }
})
export const create = mutation({
    args: {
        body: v.string(),
        image: v.optional(v.id("_storage")),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
        parentMessageId: v.optional(v.id("messages")),
        conversationId: v.optional(v.id("conversations")),

    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await getMember(ctx, args.workspaceId, userId);

        if (!member) {
            throw new Error("Unauthorized");
        }



        let _conversationId = args.conversationId;
        //only possible if we are replying in thread 1:1 conversation 
        if (!args.conversationId && !args.channelId && args.parentMessageId) {

            const parentMessage = await ctx.db.get(args.parentMessageId);

            if (!parentMessage) {
                throw new Error("Parent message not found");
            }

            _conversationId = parentMessage.conversationId;

        }

        const messageId = await ctx.db.insert("messages", {
            memberId: member._id,
            workspaceId: args.workspaceId,
            channelId: args.channelId,
            parentMessageId: args.parentMessageId,
            conversationId: _conversationId,
            body: args.body,
            image: args.image,
        })
        return messageId;
    }
})