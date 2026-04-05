'use client'

import { useEffect, useRef, useState } from 'react'

const LINES = [
  { text: '> ArmorClaw: Initializing scan...',              green: true  },
  { text: '> OpenClaw: Parsing resume PDF...',              green: false },
  { text: '> OpenClaw: Extracting skill keywords...',       green: false },
  { text: '> ArmorClaw: Cross-referencing JD...',           green: false },
  { text: '> ArmorClaw: Running fraud pattern detection...', green: false },
  { text: '> ArmorClaw: Computing Trust Score...',          green: false },
  { text: '> [████████████████████] 100%',                  green: true  },
  { text: '> STATUS: COMPLETED',                            green: true  },
]

export default function Terminal({ onDone }) {
  const [visible, setVisible] = useState([])
  const doneRef  = useRef(false)

  useEffect(() => {
    let i = 0
    const tick = () => {
      if (i >= LINES.length) {
        if (!doneRef.current) { doneRef.current = true; setTimeout(onDone, 400) }
        return
      }
      setVisible((prev) => [...prev, LINES[i]])
      i++
      setTimeout(tick, 600)
    }
    setTimeout(tick, 300)
  }, [onDone])

  return (
    <div
      className="rounded-[4px] p-6 min-h-[420px]"
      style={{ background: '#0A0A0A', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}
    >
      {visible.map((line, idx) => (
        <div
          key={idx}
          className="mb-2 leading-relaxed"
          style={{
            color: line.green ? '#22C55E' : '#F5F5F5',
            fontWeight: line.text.includes('COMPLETED') ? 600 : 400,
          }}
        >
          {line.text}
          {idx === visible.length - 1 && visible.length < LINES.length && (
            <span className="cursor-blink" />
          )}
        </div>
      ))}
    </div>
  )
}
