"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDeleteWorkSpace } from "@/features/workspaces/api/use-delete-workspace";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-joincode";
import { useUpdateWorkSpace } from "@/features/workspaces/api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorksSpaceId } from "@/hooks/use-workspace-id";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  CopyIcon,
  RefreshCcw,
  SquareStack,
  Trash,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  joinCode: string;
  name: string;
}
export const InviteModal = ({
  open,
  setOpen,
  joinCode,
  name,
}: PreferencesModalProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will create new join code"
  );
  const workspaceId = useWorksSpaceId();
  const { mutate } = useNewJoinCode();
  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    }
    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Invoice code regenerated");
        },
        onError: () => {
          toast.error("Error while generating new code");
        },
      }
    );
  };
  const handleCopy = () => {
    const link = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Invite link copied to clipboard");
    });
  };
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>Invte</DialogTitle>
            <DialogDescription>
              use code below to invite people
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {" "}
              {joinCode}
            </p>

            <Button onClick={handleCopy} variant="ghost" size="sm">
              Copy link <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className=" flex items-center justify-between w-full">
            <Button variant="outline" onClick={handleNewCode}>
              New code <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
