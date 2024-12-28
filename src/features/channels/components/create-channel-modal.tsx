import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStartTyping } from "react-use";
import { useState } from "react";
import { useCreateChannel } from "../api/use-create-channel";
import { MutableRequestCookiesAdapter } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { useWorksSpaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateChannelModal = () => {
  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState("");
  const router = useRouter();
  const { mutate, isPending } = useCreateChannel();
  const workspaceId = useWorksSpaceId();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLocaleLowerCase();
    setName(value);
  };

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { name: name, workspaceId: workspaceId },
      {
        onSuccess: (id) => {
          toast.success("Channel created successfully");
          router.push(`/workspace/${workspaceId}/channel/${id}`);

          handleClose();
        },
        onError: () => {
          toast.error("Failed to create");
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create channel</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. plan-budget"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
