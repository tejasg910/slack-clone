"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useCreateWorkSpaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkSpace } from "../api/use-create-workspace";
import { error } from "console";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkSpaceModal = () => {
  const [open, setOpen] = useCreateWorkSpaceModal();
  const [name, setName] = useState("");
  const router = useRouter();
  const { mutate, isError, isPending } = useCreateWorkSpace();
  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await mutate(
      { name },
      {
        onSuccess: (data) => {
          console.log(data, "this is data");
          handleClose();
          toast.success("Workspace created successfully");
          router.push(`/workspace/${data}`);
        },
      }
    );

    if (isError) {
      console.log("error occured");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add workspace</DialogTitle>
        </DialogHeader>

        <form action="" onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            disabled={isPending}
            required
            onChange={(e) => setName(e.target.value)}
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />

          <div className="flex justify-end">
            <Button disabled={isPending} type="submit">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
