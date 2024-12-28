import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { Underline } from "lucide-react";

interface UseCurrentMemberWorkspaceProps {
  workspaceId: Id<"workspaces">;
}

export const useCurrentMemberWorkspace = ({
  workspaceId,
}: UseCurrentMemberWorkspaceProps) => {
  const data = useQuery(api.members.current, { workspaceId });
  const isLoading  = data === undefined;
  return {isLoading, data}
};
