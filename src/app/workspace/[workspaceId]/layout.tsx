"use client";
import React from "react";
import Toolbar from "./toolbar";
import SideBar from "./sidebar";
import SideBarButton from "./sidebar-button";
import { Home } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSidebar from "./workspace-sidebar";
interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <SideBar />
        <ResizablePanelGroup direction="horizontal" autoSaveId="ca-dssv">
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} >{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Layout;
