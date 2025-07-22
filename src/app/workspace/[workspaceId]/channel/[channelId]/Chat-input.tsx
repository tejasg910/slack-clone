import { useCreateMessage } from '@/features/message/api/use-create-message'
import { useGenerateUplaodUrl } from '@/features/upload/api/use-generate-upload-url'
import { useChannelId } from '@/hooks/use-channel-id'
import { useWorksSpaceId } from '@/hooks/use-workspace-id'
import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef, useState } from 'react'
import { useAsync } from 'react-use'
import { toast } from 'sonner'
import { Id } from '../../../../../../convex/_generated/dataModel'
const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage"> | undefined
}
interface ChatInputProps {
  placeHolder: string
}
const ChatInput = ({ placeHolder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null)
  const channelId = useChannelId()
  const workspaceId = useWorksSpaceId();
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const { mutate: generateUploadUrl } = useGenerateUplaodUrl()
  const { mutate: createMessage } = useCreateMessage()
  const handleSubmit = async ({ body, image }: { body: string, image: File | null }) => {
    try {
      setIsPending(true)
      const values: CreateMessageValues = {
        body,
        workspaceId,
        channelId,
        image: undefined
        
      }

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error("Url not found")
        }
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image
        });

        if (!result.ok) {
          throw new Error("Failed to upload image")
        }

        const { storageId } = await result.json();

        values.image = storageId;

      }
      console.log("submit button")
      console.log({ body, image })
      editorRef?.current?.enable(false);

      createMessage(values, { throwError: true })

      setEditorKey(prev => prev + 1)
    } catch (error) {
      toast.error("Failed to send message")
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);

    }
  }

  return (
    <div className='px-5 w-full'><Editor
      key={editorKey}

      onSubmit={handleSubmit}
      placeHolder={placeHolder} disabled={isPending} innerRef={editorRef} /></div>
  )
}

export default ChatInput