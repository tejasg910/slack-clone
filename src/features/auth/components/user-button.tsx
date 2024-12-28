import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import React from "react";
import { useCurrentUser } from "../api/use-current-user";
import { Loader, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";

const UserButton = () => {
  const { isLoading, data } = useCurrentUser();
  const { signOut } = useAuthActions();
  if (isLoading) {
    return <Loader className="animate-spin  size-4 text-muted-foreground" />;
  }

  if (!data) {
    return null;
  }

  const { name, email, image } = data;
  const fallbackName = name?.charAt(0).toUpperCase();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacicty-75 transition">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{fallbackName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
