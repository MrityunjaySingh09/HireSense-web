'use client'

import { ShieldCheck, AlertTriangle, MessageSquare } from 'lucide-react'
import TrustGauge    from './TrustGauge'
import ForensicsBar  from './ForensicsBar'

function confidenceBadge(level) {
  const map = { high: 'HIGH CONFIDENCE', medium: 'MEDIUM CONFIDENCE', low: 'LOW CONFIDENCE' }
  return map[level] || level.toUpperCase()
}

function scoreColorClass(score) {
  if (score > 80) return '#22C55E'
  if (score >= 50) return '#F59E0B'
  return '#EF4444'
}

export default function ResultsPanel({ data, onReanalyze }) {
  const { candidate_id, summary, scores, code_forensics, assessments, interview_questions } = data
  const hasForensics = code_forensics && code_forensics.length > 0

  return (
    <div className="flex flex-col gap-4">

      {/* Status bar */}
      <div
        className="flex items-center justify-between rounded-[4px] px-4 py-3"
        style={{ background: '#FFF', border: '1px solid #E0E0E0' }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-[#999]">{candidate_id}</span>
          <span
            className="font-mono text-[10px] text-[#F5F5F5] rounded-[2px] px-2 py-1"
            style={{ background: '#050505' }}
          >
            {summary.role_classification}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-[6px] h-[6px] rounded-full"
            style={{ background: '#22C55E' }}
          />
          <span className="font-mono text-[11px]" style={{ color: '#22C55E' }}>COMPLETED</span>
        </div>
      </div>

      {/* Trust Score */}
      <div
        className="bg-white rounded-[4px] p-6 text-center"
        style={{ border: '1px solid #E0E0E0' }}
      >
        <p
          className="font-mono text-[10px] uppercase text-[#999] mb-4"
          style={{ letterSpacing: '0.1em' }}
        >
          TRUST SCORE
        </p>
        <TrustGauge score={scores.trust_score} />
        <div className="mt-3">
          <span
            className="font-mono text-[10px] rounded-[2px] px-3 py-1"
            style={{
              background: '#F0FDF4',
              border: '1px solid #22C55E',
              color: '#16A34A',
            }}
          >
            {confidenceBadge(scores.confidence_level)}
          </span>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <SubScore
            value={`${scores.jd_match}%`}
            label="JD Match"
            color={scoreColorClass(scores.jd_match)}
          />
          <SubScore
            value={summary.role_classification.replace('Developer', 'Dev').replace('Engineer', 'Eng')}
            label="Role"
          />
          <SubScore value="3" label="Repos Verified" />
        </div>
      </div>

      {/* Strengths + Risk Factors */}
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <div className="bg-white rounded-[4px] p-5" style={{ border: '1px solid #E0E0E0' }}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={14} color="#22C55E" />
            <span
              className="font-mono text-[11px] uppercase"
              style={{ color: '#22C55E', letterSpacing: '0.1em' }}
            >
              STRENGTHS
            </span>
          </div>
          {assessments.strengths.map((s, i) => (
            <AssessItem key={i} text={s} variant="green" />
          ))}
        </div>
        <div className="bg-white rounded-[4px] p-5" style={{ border: '1px solid #E0E0E0' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} color="#EF4444" />
            <span
              className="font-mono text-[11px] uppercase"
              style={{ color: '#EF4444', letterSpacing: '0.1em' }}
            >
              RISK FACTORS
            </span>
          </div>
          {assessments.risk_factors.map((r, i) => (
            <AssessItem key={i} text={r} variant="red" />
          ))}
        </div>
      </div>

      {/* Code Forensics */}
      {hasForensics && (
        <div className="bg-white rounded-[4px] p-5" style={{ border: '1px solid #E0E0E0' }}>
          <p
            className="font-mono text-[11px] uppercase text-[#999] mb-5"
            style={{ letterSpacing: '0.1em' }}
          >
            &lt;/&gt; CODE FORENSICS
          </p>
          {code_forensics.map((f) => (
            <ForensicsBar key={f.skill} skill={f.skill} percent={f.percent} evidence={f.evidence} />
          ))}
        </div>
      )}

      {/* Interview Questions */}
      <div className="bg-white rounded-[4px] p-5" style={{ border: '1px solid #E0E0E0' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} color="#999" />
            <span
              className="font-mono text-[11px] uppercase text-[#999]"
              style={{ letterSpacing: '0.1em' }}
            >
              GENERATED INTERVIEW QUESTIONS
            </span>
          </div>
          <span
            className="font-mono text-[10px] rounded-[2px] px-2 py-1"
            style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A' }}
          >
            {interview_questions.length} questions
          </span>
        </div>
        {interview_questions.map((q, i) => (
          <QuestionCard key={i} num={i + 1} question={q} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <GhostButton onClick={onReanalyze}>Re-analyze</GhostButton>
        <GhostButton onClick={() => {
          navigator.clipboard.writeText(window.location.href).catch(() => {})
        }}>
          Copy Report Link
        </GhostButton>
      </div>
    </div>
  )
}

function SubScore({ value, label, color }) {
  return (
    <div
      className="rounded-[4px] p-3 text-center"
      style={{ background: '#FAFAFA', border: '1px solid #E0E0E0' }}
    >
      <div
        className="font-sans font-bold text-[18px]"
        style={{ color: color || '#050505' }}
      >
        {value}
      </div>
      <div className="font-mono text-[9px] uppercase text-[#999] mt-1">{label}</div>
    </div>
  )
}

function AssessItem({ text, variant }) {
  const dotColor = variant === 'green' ? '#22C55E' : '#EF4444'
  return (
    <div
      className="flex items-start gap-2 py-2 font-mono text-[11px] text-[#333] leading-relaxed"
      style={{ borderBottom: '1px solid #F5F5F5' }}
    >
      <span
        className="flex-shrink-0 mt-[5px] rounded-full"
        style={{ width: 6, height: 6, background: dotColor }}
      />
      {text}
    </div>
  )
}

function QuestionCard({ num, question }) {
  const label = String(num).padStart(2, '0')
  return (
    <div
      className="flex items-start gap-4 mb-2 rounded-[2px] transition-all duration-150 group"
      style={{
        borderLeft: '2px solid #E0E0E0',
        padding: '12px 16px',
        cursor: 'default',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderLeftColor = '#22C55E')}
      onMouseLeave={(e) => (e.currentTarget.style.borderLeftColor = '#E0E0E0')}
    >
      <span
        className="font-sans font-extrabold text-[24px] leading-none flex-shrink-0"
        style={{ color: '#EFEFEF' }}
      >
        {label}
      </span>
      <div>
        <p className="font-mono text-[11px] text-[#050505] leading-relaxed">{question}</p>
        <p className="font-mono text-[9px] mt-2" style={{ color: '#A3A3A3' }}>
          AI-generated based on verification gaps
        </p>
      </div>
    </div>
  )
}

function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="font-mono text-[11px] rounded-[4px] transition-all duration-150"
      style={{
        background: 'transparent',
        border: '1px solid #E0E0E0',
        color: '#525252',
        padding: '10px 16px',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#999'
        e.currentTarget.style.color = '#050505'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E0E0E0'
        e.currentTarget.style.color = '#525252'
      }}
    >
      {children}
    </button>
  )
}
