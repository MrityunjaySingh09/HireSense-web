'use client'

import { useEffect, useState } from 'react'

const TOTAL_ARC = 345

function scoreColor(score) {
  if (score > 80) return '#22C55E'
  if (score >= 50) return '#F59E0B'
  return '#EF4444'
}

export default function TrustGauge({ score }) {
  const [offset, setOffset] = useState(TOTAL_ARC)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(TOTAL_ARC - (score / 100) * TOTAL_ARC)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  const color = scoreColor(score)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 280, height: 160 }}>
        <svg
          width="280"
          height="160"
          viewBox="0 0 280 160"
          style={{ overflow: 'visible' }}
        >
          {/* Track */}
          <path
            d="M 30 140 A 110 110 0 0 1 250 140"
            fill="none"
            stroke="#EFEFEF"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d="M 30 140 A 110 110 0 0 1 250 140"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={TOTAL_ARC}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.3s' }}
          />
        </svg>

        {/* Score text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-4"
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex items-baseline gap-1">
            <span
              className="font-sans font-bold text-[56px] leading-none text-[#050505]"
            >
              {score}
            </span>
            <span className="font-mono text-[18px] text-[#A3A3A3]">/100</span>
          </div>
        </div>
      </div>
    </div>
  )
}
