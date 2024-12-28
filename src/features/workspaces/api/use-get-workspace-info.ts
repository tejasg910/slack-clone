import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface UseGetWorkSpacesInfoProps {
  id: Id<"workspaces">;
}
export const useGetWorkSpaceInfo = ({ id }: UseGetWorkSpacesInfoProps) => {
  const data = useQuery(api.workspaces.getInfoById, { id });

  const isLoading = data === undefined;
  return { data, isLoading };
};
