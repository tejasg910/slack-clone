import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {} from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Hint } from "@/components/hint";
import { PreferencesModal } from "./preferences-moda";
import { InviteModal } from "./invite-modal";
interface WorkSpaceHeaderProp {
  workspace: Doc<"workspaces">;
  isAdmin: Boolean;
}
const WorkspaceHeader = ({ workspace, isAdmin }: WorkSpaceHeaderProp) => {
  const [open, setOpen] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  return (
    <>
      <PreferencesModal
        open={open}
        setOpen={setOpen}
        initialValue={workspace.name}
      />
      <InviteModal
        joinCode={workspace.joinCode}
        name={workspace.name}
        open={openInviteModal}
        setOpen={setOpenInviteModal}
      />
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
              size="sm"
            >
              <span className="truncate">{workspace?.name}</span>
              <ChevronDown className="size-4 ml-1  shrink-0" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" side="bottom" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="size-9 relative overflow-hidden bg-[#616061]  text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
                {workspace?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold ">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    setOpenInviteModal(true);
                  }}
                  className="curspor-pointer"
                >
                  Invite people to {workspace.name}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setOpen(true)}
                  className="curspor-pointer"
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-0.5">
          <Hint label="New message" align="center" side="bottom">
            <Button variant="transparent" size="iconSm">
              <ListFilter className="size-4" />
            </Button>
          </Hint>

          <Hint label="New message" align="center" side="bottom">
            <Button variant="transparent" size="iconSm">
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};

export default WorkspaceHeader;
