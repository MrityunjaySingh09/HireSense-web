'use client'

import { useEffect, useState } from 'react'
import { useRouter }           from 'next/navigation'
import { ScrollText, Loader2 } from 'lucide-react'
import TopBar                  from '@/components/layout/TopBar'
import { mockHistory }         from '@/lib/mockData'

async function getHistory() {
  try {
    const res = await fetch('/api/ledger')
    if (!res.ok) throw new Error('Failed')
    const data = await res.json()
    return data.length ? data : mockHistory
  } catch (err) {
    console.error('Fallback to mock/local:', err)
    try {
      const stored = JSON.parse(localStorage.getItem('armorclaw_history') || '[]')
      return stored.length ? stored : mockHistory
    } catch {
      return mockHistory
    }
  }
}

function trustColor(score) {
  if (score > 80)  return '#22C55E'
  if (score >= 50) return '#F59E0B'
  return '#EF4444'
}

export default function LedgerPage() {
  const [history, setHistory] = useState(null)
  const router = useRouter()

  useEffect(() => {
    getHistory().then(setHistory)
  }, [])

  const isLoading  = history === null
  const totalScans = history?.length ?? 0
  const avgScore   = history?.length
    ? Math.round(history.reduce((s, h) => s + (h.trust_score ?? 0), 0) / history.length)
    : 0
  const fraudFlags = history?.filter((h) => (h.trust_score ?? 0) < 50).length ?? 0

  return (
    <div className="p-8">
      <TopBar breadcrumb="ARMORCLAW / LEDGER" />

      <h1 className="font-sans font-extrabold text-[32px] text-[#050505] mb-2">
        VERIFICATION LEDGER
      </h1>
      <p className="font-mono text-[12px] text-[#777] mb-8">
        All past ArmorClaw scans on this device.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8 max-sm:grid-cols-1">
        <StatCard value={isLoading ? '—' : totalScans} label="Total Scans"     />
        <StatCard value={isLoading ? '—' : avgScore}   label="Avg Trust Score" />
        <StatCard value={isLoading ? '—' : fraudFlags} label="Fraud Flags"     />
      </div>

      <div className="bg-white rounded-[4px]" style={{ border: '1px solid #E0E0E0' }}>
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-16">
            <Loader2 size={16} className="animate-spin text-[#CCC]" />
            <span className="font-mono text-[11px] text-[#AAA] uppercase tracking-widest">
              Loading records...
            </span>
          </div>
        ) : history.length === 0 ? (
          <EmptyState onCta={() => router.push('/verification')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #E0E0E0' }}>
                  {['ID', 'Role Detected', 'Trust Score', 'JD Match', 'Status', 'Date', 'Action'].map((h) => (
                    <th
                      key={h}
                      className="font-mono text-left"
                      style={{
                        fontSize: 10,
                        textTransform: 'uppercase',
                        color: '#999',
                        letterSpacing: '0.1em',
                        padding: '12px 16px',
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((row) => {
                  const rowId = row._id || row.id
                  return (
                    <tr
                      key={rowId}
                      style={{ borderBottom: '1px solid #F0F0F0' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FAFAFA')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="font-mono" style={{ fontSize: 10, color: '#999', padding: '12px 16px' }}>
                        {rowId?.toString().slice(0, 13)}...
                      </td>
                      <td className="font-mono" style={{ fontSize: 12, color: '#050505', padding: '12px 16px' }}>
                        {row.role ?? '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          className="font-mono font-semibold"
                          style={{ fontSize: 12, color: trustColor(row.trust_score ?? 0) }}
                        >
                          {row.trust_score ?? '—'}
                        </span>
                      </td>
                      <td className="font-mono" style={{ fontSize: 12, color: '#050505', padding: '12px 16px' }}>
                        {row.jd_match != null ? `${row.jd_match}%` : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="font-mono" style={{ fontSize: 11, color: '#999', padding: '12px 16px' }}>
                        {row.date ?? '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => {
                            if (row.result_data) {
                              const encoded = encodeURIComponent(JSON.stringify(row.result_data))
                              router.push(`/verification/results?data=${encoded}`)
                            } else if (rowId) {
                              router.push(`/verification/results?id=${rowId}`)
                            } else {
                              router.push('/verification')
                            }
                          }}
                          className="font-mono transition-all duration-150"
                          style={{
                            fontSize: 11,
                            color: '#525252',
                            border: '1px solid #E0E0E0',
                            borderRadius: 2,
                            padding: '4px 10px',
                            background: 'transparent',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#050505'
                            e.currentTarget.style.borderColor = '#999'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#525252'
                            e.currentTarget.style.borderColor = '#E0E0E0'
                          }}
                        >
                          VIEW
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="bg-white rounded-[4px] p-5" style={{ border: '1px solid #E0E0E0' }}>
      <div className="font-sans font-bold text-[28px] text-[#050505]">{value}</div>
      <div
        className="font-mono text-[9px] uppercase text-[#999] mt-1"
        style={{ letterSpacing: '0.12em' }}
      >
        {label}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const isComplete = status === 'completed'
  return (
    <span
      className="font-mono"
      style={{
        fontSize: 10,
        padding: '3px 8px',
        borderRadius: 2,
        background: isComplete ? '#F0FDF4' : '#FFFBEB',
        border:     `1px solid ${isComplete ? '#BBF7D0' : '#FDE68A'}`,
        color:      isComplete ? '#16A34A' : '#B45309',
      }}
    >
      {isComplete ? 'COMPLETED' : 'PROCESSING'}
    </span>
  )
}

function EmptyState({ onCta }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center rounded-[4px]"
      style={{ padding: '60px 24px', border: '1.5px dashed #D4D4D4', margin: 16 }}
    >
      <ScrollText size={40} color="#D0D0D0" style={{ marginBottom: 16 }} />
      <p className="font-mono text-[13px] text-[#999] mb-4">No analyses yet.</p>
      <button
        onClick={onCta}
        className="font-mono text-[11px] rounded-[4px] transition-all"
        style={{
          background: '#050505',
          color: '#F5F5F5',
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Run your first verification
      </button>
    </div>
  )
}