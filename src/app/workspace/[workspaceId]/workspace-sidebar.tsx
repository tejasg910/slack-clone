import { useCurrentMemberWorkspace } from "@/features/members/api/use-current-member";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useWorksSpaceId } from "@/hooks/use-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import React from "react";
import WorkspaceHeader from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkSpaceSection } from "./workspace-section";
import { useGetMembersWorkspace } from "@/features/members/api/use-get-members";
import UserItem from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";

const WorkspaceSidebar = () => {
  const workspaceId = useWorksSpaceId();
  const [open, setOpen] = useCreateChannelModal();
  console.log("this is open, ", open);

  const channelId = useChannelId();
  const { data: member, isLoading: memberLoading } = useCurrentMemberWorkspace({
    workspaceId,
  });

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkSpace({
    id: workspaceId,
  });

  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const { data: members, isLoading: membersLoading } = useGetMembersWorkspace({
    workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!member || !workspace) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">No workspace found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col  bg-[#5e2c5f] h-full ">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Treads" id="threads" icon={MessageSquareText} />
        <SidebarItem label="Drafts & Sent" id="drafts" icon={SendHorizonal} />
      </div>
      <WorkSpaceSection
        label="Channels"
        hint="New Channel"
        onNew={
          member.role === "admin"
            ? () => {
                setOpen(true);
              }
            : undefined
        }
      >
        {channels?.map((item) => {
          return (
            <SidebarItem
              key={item._id}
              label={item.name}
              id={item._id}
              icon={HashIcon}
              variant={channelId === item?._id ? "active" : "default"}
            />
          );
        })}
      </WorkSpaceSection>
      <WorkSpaceSection
        label="Direct message"
        hint="New Message"
        onNew={() => {}}
      >
        {members &&
          members.map((item) => {
            return (
              <UserItem
                key={item._id}
                image={item.user.image}
                id={item._id}
                label={item.user.name}
              />
            );
          })}
      </WorkSpaceSection>
      '
    </div>
  );
};

export default WorkspaceSidebar;
