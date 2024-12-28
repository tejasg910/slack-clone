import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { Underline } from "lucide-react";

interface UseGetMembersWorkspaceProps {
  workspaceId: Id<"workspaces">;
}

export const useGetMembersWorkspace = ({
  workspaceId,
}: UseGetMembersWorkspaceProps) => {
  const data = useQuery(api.members.get, { workspaceId });
  const isLoading = data === undefined;
  return { isLoading, data };
};
