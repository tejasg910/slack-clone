import { useWorksSpaceId } from "@/hooks/use-workspace-id";
import { Doc, Id } from "../../convex/_generated/dataModel"
import { useCurrentMemberWorkspace } from "@/features/members/api/use-current-member";
import { cn } from "@/lib/utils";
import { Hint } from "./hint";
import { EmojiPopOver } from "./ui/emoji-popover";
import { MdOutlineAddReaction } from "react-icons/md";

interface ReactionType {
    data: Array<Omit<Doc<"reactions">, "memberId"> & {
        count: number,
        memberIds: Id<"members">[]
    }

    >;
    onChange: (value: string) => void;
}


export const Reactions = ({ data, onChange }: ReactionType) => {
    const workspaceId = useWorksSpaceId();
    const { data: currentMember } = useCurrentMemberWorkspace({ workspaceId });

    if (data.length == 0 || !currentMember?._id) {
        return null;;
    }
    return <div className="flex items-center gap-1 mt-1 mb-1">

        {
            data.map((reaction) => (

                <Hint key={reaction._id} label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}>


                    <button onClick={() => onChange(reaction.value)} className={cn("h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1", reaction.memberIds.includes(currentMember._id) && "bg-blue-100/70 border-blue-500 text-white")}>{reaction.value} <span className={cn("text-xs font-semibold text-muted-foreground ", reaction.memberIds.includes(currentMember._id) && "text-blue-500")}>{reaction.count}</span></button></Hint>
            ))
        }

        <EmojiPopOver hint="Add reaction" onEmojiSelect={(emoji)=>onChange(emoji.native)}>
        <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1 ">
            <MdOutlineAddReaction className="size-4 "/>
        </button>
        </EmojiPopOver>
    </div>
}