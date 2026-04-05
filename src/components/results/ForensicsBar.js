'use client'

import { useEffect, useState } from 'react'

function barColor(pct) {
  if (pct > 50) return '#22C55E'
  if (pct >= 20) return '#F59E0B'
  return '#EF4444'
}

export default function ForensicsBar({ skill, percent, evidence }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 120)
    return () => clearTimeout(t)
  }, [percent])

  return (
    <div className="mb-5">
      <div className="flex justify-between mb-1">
        <span className="font-mono text-[11px] text-[#050505]">{skill}</span>
        <span className="font-mono text-[11px] text-[#050505]">{percent}%</span>
      </div>
      <div
        className="w-full rounded-[2px] overflow-hidden"
        style={{ height: 6, background: '#EFEFEF' }}
      >
        <div
          className="h-full rounded-[2px]"
          style={{
            width: `${width}%`,
            background: barColor(percent),
            transition: 'width 0.8s ease',
          }}
        />
      </div>
      <p className="font-mono text-[10px] text-[#999] mt-1">{evidence}</p>
    </div>
  )
}
