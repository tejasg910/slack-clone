import React, { MutableRefObject, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { PiTextAa } from "react-icons/pi"
import { MdSend } from "react-icons/md"
import Quill, { Delta, Op, QuillOptions } from "quill"
import "quill/dist/quill.snow.css"
import { Button } from './ui/button';
import { ImageIcon, Keyboard, Move3D, Smile } from 'lucide-react';
import { Hint } from './hint'
import { cn } from '@/lib/utils'
import { EmojiPopOver } from './ui/emoji-popover'

type EditorValue = {
  image: File | null,
  body: string
}

interface EditorProps {
  variant?: "create" | "update",
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeHolder?: string;
  defaultValue?: Delta | Op[]
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>
}
const Editor = ({ onCancel, onSubmit, placeHolder = "Write something...", defaultValue = [], disabled = false, innerRef, variant = "create" }: EditorProps) => {



  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null);

  const submitRef = useRef(onsubmit);
  const placeHolderRef = useRef(placeHolder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

  useLayoutEffect(() => {
    submitRef.current = onsubmit;
    placeHolderRef.current = placeHolder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;

  })

  useEffect(() => {

    if (!containerRef.current) return;


    const container = containerRef.current;
    const editorContianer = container.appendChild(container.ownerDocument.createElement("div"));


    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeHolderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }]
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {

                //todo : on submit method
                return;
              }


            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n")
              }
            }
          }
        }
      }
    }
    const quill = new Quill(editorContianer, options);

    quillRef.current = quill;
    quillRef.current.focus();


    quill.setContents(defaultValueRef.current);
    setText(quill.getText());


    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    if (innerRef) {
      innerRef.current = quill;
    }

    return () => {

      quill.off(Quill.events.TEXT_CHANGE)
      if (container) {
        container.innerHTML = ""
      }

      if (quillRef.current) {
        quillRef.current = null;
      }

      if (innerRef) {
        innerRef.current = null;
      }
    }

  }, [innerRef])


  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden")
    }
  }


  const onEmoijiSelect = (emoji: any) => {
    const quill = quillRef.current;

    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native)
  }

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
  return (
    <div className='flex flex-col'>

      <div className='flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white'>
        <div ref={containerRef} className='h-full ql-custom'
        />
        <div className='flex px-2 pb-2 z-[5]'>
          <Hint label={isToolbarVisible ? "Hide formatting" : "Show formattiing"}>


            <Button disabled={disabled} size='iconSm' variant="ghost" onClick={toggleToolbar}>

              <PiTextAa className='size-4' />
            </Button>
          </Hint>

          <EmojiPopOver onEmojiSelect={onEmoijiSelect} >

            <Button disabled={false} size='iconSm' variant="ghost" >

              <Smile className='size-4' />
            </Button>
          </EmojiPopOver>
          {variant === "create" && <Hint label="Image">


            <Button disabled={false} size='iconSm' variant="ghost" onClick={() => { }}>

              <ImageIcon className='size-4' />
            </Button>
          </Hint>}


          {
            variant === "update" && <div className='ml-auto flex items-center gap-x-2'>
              <Button

                variant="outline"
                size="sm"
                disabled={false}
                onClick={() => { }}
              >Cancel</Button>
              <Button

                disabled={false}
                size="sm"
                onClick={() => { }}

                className=' bg-[#007a5a] hover:bg-[#007a5a]/80  text-white'
              >Save</Button>
            </div>
          }

          {variant === "create" && <Button className={cn("ml-auto",
            isEmpty ? "bg-white hover:bg-white  text-muted-foreground"
              : "bg-[#007a5a] hover:bg-[#007a5a]/80  text-white"

          )}

            disabled={disabled || isEmpty} size='iconSm' variant="ghost" onClick={() => { }}>

            <MdSend className='size-4' />
          </Button>}
        </div>
      </div>
      {
        variant === "create" && <div className={cn("p-2 text-[10px]  text-muted-foreground  flex justify-end opacity-0 transition", !isEmpty && "opacity-100")}>
          <p>
            <strong>Shift + Enter </strong> to enter new line
          </p>

        </div>
      }
    </div >
  )
}

export default Editor