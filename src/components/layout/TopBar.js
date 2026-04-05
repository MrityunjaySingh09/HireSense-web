'use client'

import { useEffect, useState } from 'react'

export default function TopBar({ breadcrumb }) {
  const [dt, setDt] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setDt(
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
          '   ' +
          now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center justify-between mb-8">
      <span
        className="font-mono text-[11px]"
        style={{ color: '#999', letterSpacing: '0.05em' }}
      >
        {breadcrumb}
      </span>
      <span className="font-mono text-[11px]" style={{ color: '#999' }}>
        {dt}
      </span>
    </div>
  )
}
