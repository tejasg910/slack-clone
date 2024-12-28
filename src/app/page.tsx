"use client";
import { Button } from "@/components/ui/button";
import UserButton from "@/features/auth/components/user-button";
import { useCreateWorkSpaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkSpaces } from "@/features/workspaces/api/use-get-workspaces";
import { useAuthActions } from "@convex-dev/auth/react";
import { usePaginatedQuery } from "convex/react";
import { Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data, isLoading } = useGetWorkSpaces();
  const [open, setOpen] = useCreateWorkSpaceModal();

  const workspaceId = useMemo(() => data?.[0]?._id!, [data]);
  const { signOut } = useAuthActions();
const router = useRouter()
  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      console.log("riderct to workspace");
      router.push(`/workspace/${workspaceId}`)

    } else {
      console.log("open modal to create");

      if (!open) {
        setOpen(true);
      }
    }
  }, [workspaceId, isLoading, open, setOpen]);

  return (
    <div>
      Logged in <UserButton />
    </div>
  );
}
