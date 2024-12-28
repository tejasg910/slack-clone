"use client";
import { Button } from "@/components/ui/button";
import { useGetWorkSpaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/features/workspaces/api/use-join";
import { useWorksSpaceId } from "@/hooks/use-workspace-id";
import { Loader, Router } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
const page = () => {
  const router = useRouter();
  const workspaceId = useWorksSpaceId();
  const { data, isLoading } = useGetWorkSpaceInfo({ id: workspaceId });
  const { mutate, isPending } = useJoin();
  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`);
          toast.success("workspace joined");
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  if (isLoading) {
    return (
      <div className="flex h-full  justify-center items-center">
        <Loader className="animate-spin size-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src="/logo.png" width={60} height={60} alt="logo" />
      <div className="flex flex-col items-center justify-center max-w-md">
        <div className="flex flex-col gapy-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join Workspace</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace to join
          </p>
        </div>
        <VerificationInput
          length={7}
          onComplete={handleComplete}
          classNames={{
            container: cn(
              "flex gap-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border-gray-300 flex-items-center justify-center text-large font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default page;
