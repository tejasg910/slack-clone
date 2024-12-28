import { Button } from "@/components/ui/button";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useWorksSpaceId } from "@/hooks/use-workspace-id";
import { Info, Search } from "lucide-react";
import React from "react";

const Toolbar = () => {
  const workspaceId = useWorksSpaceId();
  const { data } = useGetWorkSpace({ id: workspaceId });
  return (
    <div className="bg-[#481349] flex items-center justify-between p-1.5 h-10 ">
      <div className="flex-1"></div>
      <div className="min-w-[280px]  max-w-[642px] grow-[2] shrink">
        <Button
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
          size="sm"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size=5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
