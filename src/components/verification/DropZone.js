'use client'

import { useRef, useState } from 'react'
import { Upload, CheckCircle2 } from 'lucide-react'

export default function DropZone({ label, onFile }) {
  const inputRef    = useRef(null)
  const [file, setFile] = useState(null)
  const [drag, setDrag] = useState(false)

  const accept = (f) => {
    if (!f || f.type !== 'application/pdf') return
    setFile(f)
    onFile(f)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    accept(e.dataTransfer.files[0])
  }

  return (
    <div className="mb-4">
      <p
        className="font-mono text-[10px] uppercase mb-2"
        style={{ color: '#525252', letterSpacing: '0.1em' }}
      >
        {label}
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className="relative flex flex-col items-center justify-center text-center cursor-pointer rounded-[4px] transition-all duration-150"
        style={{
          border: file
            ? '1.5px solid #22C55E'
            : drag
            ? '1.5px dashed #999'
            : '1.5px dashed #C0C0C0',
          background: file ? '#F0FDF4' : drag ? '#F5F5F5' : '#FAFAFA',
          padding: '28px 20px',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => accept(e.target.files[0])}
        />

        {file ? (
          <>
            <CheckCircle2 size={24} color="#22C55E" className="mb-2" />
            <p className="font-mono text-[11px] text-[#22C55E]">{file.name}</p>
            <p className="font-mono text-[10px] text-[#A3A3A3] mt-1">
              {(file.size / 1024).toFixed(0)} KB — click to replace
            </p>
          </>
        ) : (
          <>
            <Upload size={24} color="#999" className="mb-2" />
            <p className="font-mono text-[11px] text-[#525252]">
              Drop {label.toLowerCase()} here or click to upload
            </p>
            <p className="font-mono text-[10px] text-[#A3A3A3] mt-1">.PDF only</p>
          </>
        )}
      </div>
    </div>
  )
}
