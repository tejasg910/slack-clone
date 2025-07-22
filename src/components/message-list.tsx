import { GetMessagesReturnType } from "@/features/upload/api/use-get-message";
import { format, isYesterday, isToday, differenceInMinutes } from "date-fns";
import { Message } from "./message";
import { current } from "../../convex/members";
import { ChannelHero } from "./channel-hero";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useWorksSpaceId } from "@/hooks/use-workspace-id";
import { useCurrentMemberWorkspace } from "@/features/members/api/use-current-member";
interface MessageListProps {
    memberName?: string;
    memberImage?: string;
    channelName?: string;
    channelCreationTime?: number;
    variant?: "channel" | "thread" | "conversation";
    data: GetMessagesReturnType | undefined;
    loadMore: () => void;
    isLoadMore: boolean;
    canLoadMore: boolean;

}
const TIME_THRESHHOLD = 5;


const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isToday(date)) return "Today";

    if (isYesterday(date)) return "YesterDay"
    return format(date, "EEEE, MMMM d")
}


export const MessageList = ({
    memberImage,
    memberName,
    channelName,
    channelCreationTime,
    data,
    variant = "channel",
    canLoadMore,
    isLoadMore,
    loadMore,

}: MessageListProps) => {
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
    const workspaceId = useWorksSpaceId();
    const { data: currentMember } = useCurrentMemberWorkspace({ workspaceId })
    const groupedMessages = data?.reduce((groups, message) => {
        const date = new Date(message._creationTime);
        const datekey = format(date, "yyyy-MM-dd");


        if (!groups[datekey]) {
            groups[datekey] = [];
        }

        groups[datekey].unshift(message);

        return groups;
    }, {} as Record<string, typeof data>)

    return (
        <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">

            {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
                <div key={dateKey}>
                    <div className="text-center my-2 relative">
                        <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                        <span className="realtive inline-block bg-white px-4  py-1 rounded-full  text-xsm border border-gray-300 shadow-sm">{formatDateLabel(dateKey)}</span>
                    </div>
                    {messages.map((message, index) => {


                        const prevMessage = messages[index - 1];


                        const isCompact = prevMessage && prevMessage.user?._id === message.user?._id && differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) < TIME_THRESHHOLD;
                        return (

                            <Message key={message._id} id={message._id} memberId={message.memberId} authorImage={message.user.image}
                                authorName={message.user.name}
                                isAuthor={message.memberId === currentMember?._id}
                                reactions={message.reactions}
                                body={message.body}
                                image={message.image}
                                updatedAt={message.updatedAt}
                                createdAt={message._creationTime}
                                isEdititing={editingId === message._id}
                                setEditingId={setEditingId}
                                isCompact={isCompact}
                                hideThreadButton={variant == "thread"}
                                threadCounts={message.threadCount}
                                threadImage={message.threadImage}
                                threadTimestamp={message.threadTimestamp} />

                        )
                    })}




                </div>
            ))}

            {variant == "channel" && channelName && channelCreationTime && (
                <ChannelHero
                    name={channelName}
                    creationTime={channelCreationTime}
                />
            )}
        </div>
    )
}