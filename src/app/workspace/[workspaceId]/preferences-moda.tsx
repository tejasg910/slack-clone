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
import { useUpdateWorkSpace } from "@/features/workspaces/api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorksSpaceId } from "@/hooks/use-workspace-id";
import { DialogClose } from "@radix-ui/react-dialog";
import { SquareStack, Trash, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}
export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const [DialogConfirm, confirm] = useConfirm(
    "Are you sure?",
    "This action is isreversible"
  );
  const router = useRouter();
  const workspaceId = useWorksSpaceId();
  const {
    mutate: udpateWorkSpace,

    isPending: updateWorkspaceLoading,
  } = useUpdateWorkSpace();

  const {
    mutate: deleteWorkSpace,
    isError: isDeleteWorkspaceError,
    isPending: deleteWorkspaceLoading,
  } = useDeleteWorkSpace();

  const [openEdit, setOpenEdit] = useState(false);
  const [value, setValue] = useState(initialValue);
  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    }
    deleteWorkSpace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          setOpenEdit(false);
          toast.success("Workspace deleted successfully");
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to delete workspace");
        },
      }
    );
  };
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("calling api");
    udpateWorkSpace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          console.log("this is success");
          setOpenEdit(false);
          toast.success("Workspace updated");
        },
        onError: () => {
          console.log("this is error");

          toast.error("Failed to udpate workspace");
        },
      }
    );
  };
  return (
    <>
      <DialogConfirm />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{initialValue}</DialogTitle>
          </DialogHeader>

          <div className="px-4 pb-4 flex flex-col gap-2">
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border  cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>

                  <p className="text-sm">{initialValue}</p>
                </div>
              </DialogTrigger>

              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        disabled={updateWorkspaceLoading}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={updateWorkspaceLoading}>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={deleteWorkspaceLoading}
              onClick={handleDelete}
              className=" flex items-center gap-x-2 px-5 py-5 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
