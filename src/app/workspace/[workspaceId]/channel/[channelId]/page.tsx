"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import React from "react";
import Header from "./header";
import ChatInput from "./Chat-input";
import { useGetMessages } from "@/features/upload/api/use-get-message";
import { MessageList } from "@/components/message-list";

const ChannelId = () => {

  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({ channelId });
  const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

  if (channelLoading || status === "LoadingFirstPage") {
    return <div className="h-full flex-1 flex items-center justify-center">
      <Loader className="animate-spin  text-muted-foreground size-5" />
    </div>
  }
  if (!channel) {
    return <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
      <TriangleAlert className=" text-muted-foreground size-5" />
      <span className="text-sm text-muted-foreground">Channel not found</span>
    </div>
  }

  return <div className="flex flex-col h-full">
    <Header title={channel.name} />
    <MessageList channelName={channel.name} channelCreationTime={channel._creationTime}
      data={results} loadMore={loadMore} isLoadMore={status === "LoadingMore"} canLoadMore={status === "CanLoadMore"} />

    <ChatInput placeHolder={`Message #${channel.name}`} />
  </div>;
};

export default ChannelId;
