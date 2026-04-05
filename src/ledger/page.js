'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LedgerPage() {
  const router = useRouter()
  const [history, setHistory] = useState(null)   // null = loading, [] = empty
  const [error, setError]     = useState(null)
  const [search, setSearch]   = useState('')
  const [sort, setSort]       = useState({ key: 'createdAt', dir: 'desc' })

  useEffect(() => {
    fetch('/api/ledger')
      .then(r => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`)
        return r.json()
      })
      .then(setHistory)
      .catch(err => setError(err.message))
  }, [])

  const handleView = (row) => {
    if (row.result_data) {
      const encoded = encodeURIComponent(JSON.stringify(row.result_data))
      router.push(`/verification/results?data=${encoded}`)
    } else if (row._id) {
      router.push(`/verification/results?id=${row._id}`)
    } else {
      router.push('/verification')
    }
  }

  const toggleSort = (key) => {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'desc' }
    )
  }

  const filtered = (history ?? [])
    .filter(row => {
      const q = search.toLowerCase()
      return (
        !q ||
        row.candidate_name?.toLowerCase().includes(q) ||
        row.role?.toLowerCase().includes(q) ||
        row.status?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const mul = sort.dir === 'asc' ? 1 : -1
      if (sort.key === 'trust_score' || sort.key === 'jd_match') {
        return mul * ((a[sort.key] ?? 0) - (b[sort.key] ?? 0))
      }
      return mul * String(a[sort.key] ?? '').localeCompare(String(b[sort.key] ?? ''))
    })

  const avg = (key) => {
    if (!history?.length) return '—'
    const vals = history.map(h => h[key] ?? 0)
    return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
  }

  const scoreColor = (score) => {
    if (score >= 75) return '#22c55e'
    if (score >= 50) return '#f59e0b'
    return '#ef4444'
  }

  const statusBadge = (status) => {
    const map = {
      completed: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', label: 'Completed' },
      processing: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Processing' },
      failed: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'Failed' },
    }
    const s = map[status] ?? { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', label: status ?? '—' }
    return (
      <span style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.color}30`,
        borderRadius: 6,
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.03em',
      }}>
        {s.label}
      </span>
    )
  }

  const SortIcon = ({ col }) => {
    if (sort.key !== col) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>
    return <span style={{ marginLeft: 4, color: '#22c55e' }}>{sort.dir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f0a',
      color: '#e2e8e2',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      padding: '40px 32px',
    }}>
      {/* Header */}
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ fontSize: 11, color: '#22c55e', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                HireSense
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f0fdf0', margin: 0, letterSpacing: '-0.02em' }}>
              Audit Ledger
            </h1>
            <p style={{ color: '#4b5e4b', fontSize: 13, margin: '6px 0 0' }}>
              All candidate verification records
            </p>
          </div>
          <button
            onClick={() => router.push('/verification')}
            style={{
              background: 'transparent',
              border: '1px solid #22c55e40',
              color: '#22c55e',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.05em',
            }}
          >
            + New Scan
          </button>
        </div>

        {/* Stats */}
        {history !== null && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            marginBottom: 32,
          }}>
            {[
              { label: 'Total Scans', value: history.length },
              { label: 'Avg Trust Score', value: avg('trust_score') + (history.length ? '%' : '') },
              { label: 'Avg JD Match', value: avg('jd_match') + (history.length ? '%' : '') },
              {
                label: 'High Risk',
                value: history.filter(h => (h.trust_score ?? 0) < 50).length,
                accent: '#ef4444',
              },
            ].map(({ label, value, accent }) => (
              <div key={label} style={{
                background: '#0d150d',
                border: '1px solid #1a2e1a',
                borderRadius: 10,
                padding: '18px 20px',
              }}>
                <div style={{ fontSize: 11, color: '#4b5e4b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {label}
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: accent ?? '#22c55e' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Search by name, role, or status..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: '#0d150d',
              border: '1px solid #1a2e1a',
              borderRadius: 8,
              padding: '10px 16px',
              color: '#e2e8e2',
              fontSize: 13,
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Table */}
        <div style={{
          background: '#0d150d',
          border: '1px solid #1a2e1a',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          {/* Loading */}
          {history === null && !error && (
            <div style={{ padding: 48, textAlign: 'center', color: '#4b5e4b', fontSize: 13 }}>
              <div style={{ marginBottom: 12, color: '#22c55e' }}>⏳</div>
              Loading audit records...
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ padding: 48, textAlign: 'center', color: '#ef4444', fontSize: 13 }}>
              Failed to load records: {error}
            </div>
          )}

          {/* Empty */}
          {history !== null && !error && filtered.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', color: '#4b5e4b', fontSize: 13 }}>
              {search ? 'No records match your search.' : 'No audit records yet. Run your first scan.'}
            </div>
          )}

          {/* Table */}
          {history !== null && !error && filtered.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a2e1a' }}>
                  {[
                    { label: 'Candidate', key: 'candidate_name' },
                    { label: 'Role', key: 'role' },
                    { label: 'Trust Score', key: 'trust_score' },
                    { label: 'JD Match', key: 'jd_match' },
                    { label: 'Status', key: 'status' },
                    { label: 'Date', key: 'createdAt' },
                    { label: '', key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      onClick={() => key && toggleSort(key)}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: 11,
                        color: '#4b5e4b',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: key ? 'pointer' : 'default',
                        userSelect: 'none',
                        fontWeight: 500,
                      }}
                    >
                      {label}{key && <SortIcon col={key} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr
                    key={row._id ?? i}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid #111a11' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#111a11'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#e2e8e2' }}>
                      {row.candidate_name ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                      {row.role ?? row.summary?.role_classification ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {row.trust_score != null ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: scoreColor(row.trust_score),
                          }}>
                            {row.trust_score}%
                          </span>
                          <div style={{
                            flex: 1, height: 4, background: '#1a2e1a', borderRadius: 2, minWidth: 48,
                          }}>
                            <div style={{
                              width: `${row.trust_score}%`,
                              height: '100%',
                              background: scoreColor(row.trust_score),
                              borderRadius: 2,
                            }} />
                          </div>
                        </div>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#94a3b8' }}>
                      {row.jd_match != null ? `${row.jd_match}%` : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {statusBadge(row.status)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#4b5e4b' }}>
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => handleView(row)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #22c55e30',
                          color: '#22c55e',
                          borderRadius: 6,
                          padding: '5px 14px',
                          fontSize: 12,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          letterSpacing: '0.05em',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#22c55e15'
                          e.currentTarget.style.borderColor = '#22c55e'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.borderColor = '#22c55e30'
                        }}
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {history !== null && filtered.length > 0 && (
          <div style={{ marginTop: 12, fontSize: 11, color: '#2d3e2d', textAlign: 'right' }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            {search && history.length !== filtered.length ? ` of ${history.length}` : ''}
          </div>
        )}
      </div>
    </div>
  )
}