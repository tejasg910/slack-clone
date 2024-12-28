import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
interface HeaderProps {
    title: string
}

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogPortal, DialogTitle, DialogTrigger, DialogOverlay } from "@/components/ui/dialog"
import { TrashIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useChannelId } from '@/hooks/use-channel-id'
import { useUpdateChannel } from '@/features/channels/api/use-update-channel'
import { toast } from 'sonner'
import { useConfirm } from '@/hooks/use-confirm'
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel'
import { useRouter } from 'next/navigation'
import { useWorksSpaceId } from '@/hooks/use-workspace-id'
import { useCurrentMemberWorkspace } from '@/features/members/api/use-current-member'
const Header = ({ title }: HeaderProps) => {
    const channelId = useChannelId();
    const workSpaceId = useWorksSpaceId()
    const { data: member } = useCurrentMemberWorkspace({ workspaceId: workSpaceId });
    const handleOpen = () => {
        if (member?.role !== "admin") return;
        setOpen(true)
    }
    const router = useRouter();

    const [ConfirmDialog, confirm] = useConfirm("Delete this channel?", "You are about to delete this channel. This action is irreversible")
    const [value, setvalue] = useState(title);
    const [open, setOpen] = useState(false);

    const { mutate: updateChannel, isPending: updatingChannel } = useUpdateChannel()
    const { mutate: removeChannel, isPending: removingChannel } = useRemoveChannel()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLocaleLowerCase();
        setvalue(value);
    };


    const handleDelete = async () => {
        const ok = await confirm();

        if (!ok) return;
        removeChannel({ id: channelId }, {
            onSuccess: () => {
                toast.success("Channel deleted");
                router.push(`/workspace/${workSpaceId}`)
            },
            onError: () => {
                toast.error("Failed to delete")
            }
        })

    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        updateChannel({ id: channelId, name: value }, {
            onSuccess: (() => {
                toast.success("Channel updated");
                setOpen(false)
            }),

            onError: (() => {
                toast.error("Failed to update")
            })
        })

    }
    return (
        <div className='bg-white border-b  h-[49px] flex items-center px-4 overflow-hidden'>
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>


                    <Button variant="ghost" className='font-semibold px-2 overflow-hidden w-auto' size="sm">
                        <span className='truncate'># {title}</span>
                        <FaChevronDown className='size-2.5 ml-2' />
                    </Button>
                </DialogTrigger>'
                <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
                    <DialogHeader className='p-4 border-b bg-white'>
                        # {title}
                    </DialogHeader>

                    <div className='flex flex-col px-4 pb-4 gap-y-2'>

                        <Dialog open={open} onOpenChange={handleOpen}>


                            <DialogTrigger asChild>


                                <div className='px-4 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>

                                    <div className='flex items-center justify-between'>

                                        <p className='text-sm font-semibold'>Channel Name</p>
                                        {member?.role === "admin" && <p className='text-sm text-[#1264a3] hover:underline font-semibold'>Edit</p>}
                                    </div>
                                    <p className='text-sm'>#{title}</p>
                                </div>



                            </DialogTrigger>


                            <DialogContent className='bg-white'>
                                <DialogHeader>
                                    <DialogTitle>Rename this channel</DialogTitle>

                                </DialogHeader>

                                <form action="" onSubmit={handleSubmit} className='space-y-4'>
                                    <Input value={value} onChange={handleChange} disabled={false} minLength={3} maxLength={80} placeholder='e.g. plan-budget' />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={false}>Cancel</Button>
                                        </DialogClose>

                                        <Button type='submit' disabled={updatingChannel}>Save</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>



                        </Dialog>
                        {member?.role === "admin" &&
                            <button onClick={handleDelete} disabled={removingChannel} className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600'>
                                <TrashIcon className='size-4' />
                                <p className='text-sm font-semibold'>Delete Channel</p>
                            </button>}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Header