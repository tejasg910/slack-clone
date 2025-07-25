import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { EmojiPopOver } from "./ui/emoji-popover";

interface ToolbarProps {
    isAuthor: boolean;
    isPending: boolean;
    handleEdit: () => void;
    handleThread: () => void;
    handleDelete: () => void;
    handleReaction: (value: string) => void;
    hideThreadButton?: boolean;
}


export const Toolbar = ({ handleDelete, handleEdit, handleReaction, handleThread, isAuthor, isPending, hideThreadButton, }: ToolbarProps) => {
    return (
        <div className="absolute top-0 right-5 ">
            <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded shadow-xm">
                <EmojiPopOver hint="Reaction" onEmojiSelect={(emoji) => handleReaction(emoji.native)}>


                    <Button variant="ghost" size="iconSm" disabled={isPending}>
                        <Smile className="size-4" />
                    </Button>
                </EmojiPopOver>

                {
                    !hideThreadButton && (
                        <Hint label="Reply in thread">

                            <Button onClick={handleThread} variant="ghost" size="iconSm" disabled={isPending}>
                                <MessageSquareTextIcon className="size-4" />
                            </Button>
                        </Hint>
                    )
                }

                {isAuthor && <Hint label="Edit message">

                    <Button onClick={handleEdit} variant="ghost" size="iconSm" disabled={isPending}>
                        <Pencil className="size-4" />
                    </Button>
                </Hint>}

                {
                    isAuthor && <Hint label="Delete message">


                        <Button onClick={handleDelete} variant="ghost" size="iconSm" disabled={isPending}>
                            <Trash className="size-4" />
                        </Button>
                    </Hint>
                }


            </div>
        </div>
    )
}