import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { ImageIcon } from 'lucide-react'

const TestComponent = () => {
    const [image, setImage] = useState<File | null>(null)
    const imageElementRef = useRef<HTMLInputElement>(null)
    return (
        <div>
            <input type="file" className='hidden' accept='image/*' ref={imageElementRef} onChange={(e) => setImage(e.target.files![0])}
            />
            <Button disabled={false} size='iconSm' variant="ghost" onClick={() => imageElementRef.current?.click()}>

                <ImageIcon className='size-4' />
            </Button>
        </div>
    )
}

export default TestComponent