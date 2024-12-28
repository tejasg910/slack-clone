"use client";
import { useCreateChannel } from "@/features/channels/api/use-create-channel";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMemberWorkspace } from "@/features/members/api/use-current-member";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useWorksSpaceId } from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";

const WorkspaceId = () => {
  const router = useRouter();
  const workspaceId = useWorksSpaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMemberWorkspace({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkSpace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => {
    return channels?.[0]?._id;
  }, [channels]);
  const isAdmin = useMemo(() => {
    return member?.role === "admin";
  }, [member?.role]);
  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      memberLoading ||
      !member ||
      !workspace
    ) {
      return;
    }
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [
    channelId,
    workspaceLoading,
    channelsLoading,
    workspace,
    open,
    setOpen,
    router,
    workspaceId,
    isAdmin,
    member,
    memberLoading,
  ]);

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-forground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6  text-muted-forground" />
        <span className="text-muted-forground">Worksapce not found</span>
      </div>
    );
  }
  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6  text-muted-forground" />
      <span className="text-muted-forground">Channel not found</span>
    </div>
  );
};

export default WorkspaceId;
