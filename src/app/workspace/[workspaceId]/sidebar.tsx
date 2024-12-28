import UserButton from "@/features/auth/components/user-button";
import React from "react";
import WorkSpaceSwitcher from "./workspace-switcher";
import SideBarButton from "./sidebar-button";
import { Bell, Home, MessageSquare, MoreHorizontal } from "lucide-react";

const SideBar = () => {
  return (
    <aside className="w-[70px] bg-[#481349] h-full flex flex-col gap-y-4 items-center pt-[9px] pb-[4px]">
      <WorkSpaceSwitcher />
      <SideBarButton icon={Home} label="Home" isActive />
      <SideBarButton icon={MessageSquare} label="DMs"  />
      <SideBarButton icon={Bell} label="Activity"  />
      <SideBarButton icon={MoreHorizontal} label="More"  />

      <div className="flex flex-col mt-auto justify-center items-center  gap-y-1">
        <UserButton />
      </div>
    </aside>
  );
};

export default SideBar;
