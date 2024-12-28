import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef } from 'react'
const Editor = dynamic(() => import("@/components/editor"), { ssr: false })


interface ChatInputProps {
  placeHolder: string
}
const ChatInput = ({placeHolder }:ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null)
  return (
    <div className='px-5 w-full'><Editor

      onSubmit={() => { }}
      placeHolder={placeHolder} disabled={false} innerRef={editorRef} /></div>
  )
}

export default ChatInput