import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { Hint } from "./hint";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Span } from "next/dist/trace";
import { Thumbnail } from "./thmubnail";
import { Toolbar } from "./toolbar";
import { useUpdateMessage } from "@/features/message/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/features/message/api/use-remove-message";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { Reactions } from "./reaction";
const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
interface MessageProps {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorImage?: string;
    authorName?: string;
    isAuthor: boolean;
    reactions: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }
    >;
    body: Doc<"messages">["body"];
    image: string | null | undefined;
    createdAt: Doc<"messages">["_creationTime"];
    updatedAt: Doc<"messages">["updatedAt"];
    isEdititing: boolean;
    isCompact?: boolean;
    setEditingId: (id: Id<"messages"> | null) => void;
    hideThreadButton?: boolean;
    threadCounts?: number;
    threadImage?: string;
    threadTimestamp?: number;
}
const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
    id,
    isAuthor,
    memberId,
    authorImage,
    authorName = "Member",
    reactions,
    body,
    image,
    createdAt,
    updatedAt,
    isEdititing,
    isCompact,
    setEditingId,
    hideThreadButton,
    threadCounts,
    threadImage,
    threadTimestamp,
}: MessageProps) => {
    const [Confirm, confirm] = useConfirm(
        "Delete message",
        "Are you sure you want to delete this message? This action cannot be undone."
    );
    const { mutate: upddateMessage, isPending: isUpdatingMessage } =
        useUpdateMessage();
    const { mutate: removeMessage, isPending: isRemovingMessage } =
        useRemoveMessage();
    const { mutate: toggleReaction, isPending: isTogglingReaction } =
        useToggleReaction();
    const isPending = isUpdatingMessage;


    const handleToggleReaction = (value: string) => {
        toggleReaction({ messageId: id, value }, {
            onError: () => {
                toast.error("Failed to toggle reaction")
            }
        })
    }
    const handleRemove = async () => {
        const ok = await confirm();

        if (!ok) return;

        removeMessage(
            { id },
            {
                onSuccess: () => {
                    toast.success("Message deleted");
                },
                onError: () => {
                    toast.error("Failed to updated message");
                },
            }
        );
    };
    const handleUpdate = ({ body }: { body: string }) => {
        upddateMessage(
            { id, body },
            {
                onSuccess: () => {
                    setEditingId(null);
                    toast.success("Message updated successfully");
                },
                onError: () => {
                    toast.error("Failed to update message");
                },
            }
        );
    };
    console.log(image, "this is image");

    if (isCompact) {
        return (
            <div
                className={cn(
                    "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                    isEdititing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                    isRemovingMessage &&
                    "bg-rose-500/50 transform transition-all scaley-0  origin-bottom duration-200"
                )}
            >
                <div className="flex items-start gap-2">
                    <Hint label={formatFullTime(new Date(createdAt))}>
                        <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                            {format(new Date(createdAt), "hh:mm")}
                        </button>
                    </Hint>

                    {isEdititing ? (
                        <div className="w-full h-full">
                            <Editor
                                onSubmit={handleUpdate}
                                disabled={isPending}
                                defaultValue={JSON.parse(body)}
                                onCancel={() => setEditingId(null)}
                                variant="update"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full">
                            <Renderer value={body} />
                            <Thumbnail url={image} />

                            {updatedAt ? (
                                <span className="text-xs text-muted-foreground">(edited)</span>
                            ) : null}

<Reactions data={reactions} onChange={handleToggleReaction}/>
                        </div>
                    )}
                </div>

                {!isEdititing && (
                    <Toolbar
                        handleReaction={handleToggleReaction}
                        isAuthor={isAuthor}
                        isPending={isPending}
                        handleEdit={() => setEditingId(id)}
                        handleThread={() => { }}
                        handleDelete={handleRemove}
                        hideThreadButton={hideThreadButton}
                    />
                )}
            </div>
        );
    }
    const avatarfallback = authorName.charAt(0).toUpperCase();
    return (
        <div
            className={cn(
                "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                isEdititing && "bg-[#f2c74433] hover:bg-[#f2c74433]", isRemovingMessage && "bg-rose-500/50 transform transition-all scaley-0  origin-bottom duration-200"
            )}
        >
            <div className="flex items-start gap-2">
                <button>
                    <Avatar className="rounded-md">
                        {" "}
                        <AvatarImage className="rounded-md " src={authorImage} />
                        <AvatarFallback className="rounded-md bg-sky-500 text-white">
                            {" "}
                            {avatarfallback}
                        </AvatarFallback>
                    </Avatar>
                </button>
                {isEdititing ? (
                    <div className="w-full h-full">
                        <Editor
                            onSubmit={handleUpdate}
                            disabled={isPending}
                            defaultValue={JSON.parse(body)}
                            onCancel={() => setEditingId(null)}
                            variant="update"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col w-full overflow-hidden ">
                        <div className="text-sm">
                            <button
                                className="font-bold text-primary hover:underline "
                                onClick={() => { }}
                            >
                                {authorName}
                            </button>
                            <span>&nbsp;&nbsp;</span>
                            <Hint label={formatFullTime(new Date(createdAt))}>
                                <button className="text-xs text-muted-foreground hover:underline ">
                                    {format(new Date(createdAt), "hh:mm a")}
                                </button>
                            </Hint>
                        </div>

                        <Renderer value={body} />
                        <Thumbnail url={image} />
                        {updatedAt ? (
                            <span className="text-xs text-muted-foreground">(edited)</span>
                        ) : null}

                        <Reactions data={reactions} onChange={handleToggleReaction}/>
                    </div>
                )}
            </div>

            {!isEdititing && (
                <Toolbar
                    handleReaction={handleToggleReaction}
                    isAuthor={isAuthor}
                    isPending={isPending}
                    handleEdit={() => setEditingId(id)}
                    handleThread={() => { }}
                    handleDelete={handleRemove}
                    hideThreadButton={hideThreadButton}
                />
            )}

            <Confirm />
        </div>
    );
};
