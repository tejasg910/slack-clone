import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkSpaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkSpaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useWorksSpaceId } from "@/hooks/use-workspace-id";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const WorkSpaceSwitcher = () => {
  const [_open, setOpen] = useCreateWorkSpaceModal();
  const workSpaceId = useWorksSpaceId();
  const { data: workSpace, isLoading: workSpaceLoading } = useGetWorkSpace({
    id: workSpaceId,
  });
  const router = useRouter();
  const { data: workSpaces, isLoading: workSpacesLoading } = useGetWorkSpaces();

  const filteredWorkSpaces = workSpaces?.filter(
    (workspace) => workspace?._id !== workSpaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-100 font-semibold text-xl">
          {workSpaceLoading ? (
            <Loader className="size-4 animate-spin shrink-0" />
          ) : (
            workSpace?.name?.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem className="cursor-pointer flex-col justify-start items-start capitalize">
          {workSpace?.name}
          <span className="text-xs text-muted-forground">Active workspace</span>
        </DropdownMenuItem>

        {filteredWorkSpaces?.map((workspace) => {
          return (
            <DropdownMenuItem
              className="cursor-pointer  justify-start items-center capitalize over-flow-hidden"
              onClick={() => router.push(`/workspace/${workspace._id}`)}
            >
              <div className=" size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              {workspace.name}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          Create new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkSpaceSwitcher;
