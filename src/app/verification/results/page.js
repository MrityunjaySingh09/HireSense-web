"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ArrowLeft,
  TrendingUp,
  Cpu,
  Loader2,
} from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import TopBar from '@/components/layout/TopBar';

// --- Animated score ring component ---
function ScoreRing({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let start = null;
    const duration = 1200;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const strokeOffset = circumference - (circumference * displayed) / 100;
  const color = displayed >= 75 ? '#22C55E' : displayed >= 50 ? '#FF9F43' : '#EF4444';

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={radius} stroke="#F0F0F0" strokeWidth="8" fill="transparent" />
        <circle
          cx="72" cy="72" r={radius}
          stroke={color} strokeWidth="8" fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-sans font-black text-[36px] leading-none text-[#050505]">{displayed}</span>
        <span className="font-mono text-[9px] text-[#A3A3A3] uppercase tracking-widest mt-1">/ 100</span>
      </div>
    </div>
  );
}

function AuditItem({ text, type, index }) {
  const isRisk = type === 'risk';
  return (
    <motion.li
      initial={{ opacity: 0, x: isRisk ? -12 : 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.35 }}
      className="flex gap-3 items-start"
    >
      <span className={`font-mono text-[11px] font-black mt-0.5 flex-shrink-0 ${isRisk ? 'text-red-500' : 'text-[#22C55E]'}`}>
        {isRisk ? '!!' : '✓'}
      </span>
      <p className="font-mono text-[12px] text-[#525252] leading-relaxed">{text}</p>
    </motion.li>
  );
}

function QuestionCard({ question, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.07 * index, duration: 0.4 }}
      whileHover={{ x: 8 }}
      className="p-6 bg-[#111] border border-white/5 hover:border-[#22C55E]/30 transition-all cursor-default rounded-[2px]"
    >
      <div className="flex gap-4 items-start">
        <span className="font-mono text-[10px] text-[#333] font-bold flex-shrink-0 mt-0.5">Q{String(index + 1).padStart(2, '0')}</span>
        <p className="font-mono text-[13px] leading-relaxed text-[#A3A3A3] border-l border-[#22C55E]/40 pl-4">{question}</p>
      </div>
    </motion.div>
  );
}

// Inner component to handle searchParams safely with Suspense
function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dataString = searchParams.get('data');
    const id = searchParams.get('id');

    if (dataString) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataString));
        setResult(parsed);
        setLoading(false);
      } catch (err) {
        setError('Failed to parse audit data.');
        setLoading(false);
      }
    } else if (id) {
      // Fetching from your internal API route
      fetch(`/api/ledger/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Record not found');
          return res.json();
        })
        .then((data) => {
          setResult(data.result_data || data); // Handle cases where data is nested
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError('No valid audit ID or data found.');
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen flex items-center justify-center gap-3">
      <Loader2 size={18} className="animate-spin text-[#CCC]" />
      <span className="font-mono text-[11px] text-[#AAA] uppercase">Loading Report...</span>
    </div>
  );

  if (error || !result) return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <TopBar breadcrumb="HIRESENSE / ERROR" />
      <div className="mt-10 p-6 bg-white border border-red-100 rounded">
        <p className="font-mono text-[12px] text-red-500">[SYSTEM_ERROR]: {error}</p>
        <button onClick={() => router.push('/verification')} className="mt-4 font-mono text-[11px] text-[#22C55E] underline">Return to Terminal</button>
      </div>
    </div>
  );

  const score = result.scores?.trust_score ?? 0;
  const confidence = result.scores?.confidence_level ?? 'Normal';

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen text-[#050505]">
      <TopBar breadcrumb="HIRESENSE / AUDIT_REPORT" />
      
      <button onClick={() => router.push('/verification')} className="mt-6 flex items-center gap-2 font-mono text-[10px] text-[#888] uppercase hover:text-black transition-colors">
        <ArrowLeft size={12} /> New Audit
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-[#050505] p-10 rounded text-white relative overflow-hidden min-h-[220px]">
          <div className="relative z-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#525252] mb-2">Role Classification</p>
            <h1 className="font-sans font-black text-[28px] uppercase">{result.summary?.role_classification || 'General Candidate'}</h1>
          </div>
          <div className="flex flex-wrap gap-2 mt-8 relative z-10">
            {(result.summary?.primary_skills ?? []).map(skill => (
              <span key={skill} className="px-3 py-1 bg-[#111] border border-white/10 font-mono text-[10px] uppercase text-[#22C55E]">{skill}</span>
            ))}
          </div>
          <ShieldAlert className="absolute right-[-20px] bottom-[-20px] text-white/5 w-56 h-56 -rotate-12 pointer-events-none" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-10 border border-[#EEE] rounded flex flex-col items-center justify-center text-center shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A3A3A3] mb-6">Final Trust Score</p>
          <ScoreRing score={score} />
          <p className={`mt-5 font-mono text-[11px] uppercase font-bold ${score < 50 ? 'text-red-500' : 'text-[#22C55E]'}`}>Confidence: {confidence}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Risks */}
        <div className="bg-white border-t-4 border-red-500 p-8 rounded shadow-sm">
          <h3 className="flex items-center gap-2 font-sans font-bold text-[13px] uppercase mb-6"><AlertTriangle size={18} className="text-red-500" /> Risk Factors</h3>
          <ul className="space-y-4">
            {(result.assessments?.risk_factors ?? []).map((risk, i) => <AuditItem key={i} text={risk} type="risk" index={i} />)}
          </ul>
        </div>
        {/* Strengths */}
        <div className="bg-white border-t-4 border-[#22C55E] p-8 rounded shadow-sm">
          <h3 className="flex items-center gap-2 font-sans font-bold text-[13px] uppercase mb-6"><CheckCircle size={18} className="text-[#22C55E]" /> Strengths</h3>
          <ul className="space-y-4">
            {(result.assessments?.strengths ?? []).map((str, i) => <AuditItem key={i} text={str} type="strength" index={i} />)}
          </ul>
        </div>
      </div>

      {/* Interview Guide */}
      <div className="mt-8 bg-[#050505] p-10 rounded text-white">
        <h3 className="font-sans font-bold uppercase tracking-[0.2em] text-[13px] mb-8 border-b border-white/10 pb-6">Forensic Interview Guide</h3>
        <div className="grid grid-cols-1 gap-3">
          {(result.interview_questions ?? []).map((q, i) => <QuestionCard key={i} question={q} index={i} />)}
        </div>
      </div>

      <div className="mt-12 pb-8 flex justify-between font-mono text-[9px] text-[#AAA] border-t pt-6">
        <span>HireSense Engine v1.0</span>
        <span>ID: {result._id || 'LIVE_SCAN'}</span>
      </div>
    </div>
  );
}

// Main Export with Suspense boundary (Required for useSearchParams in Next.js)
export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 font-mono text-[11px]">Initializing terminal...</div>}>
      <ResultsContent />
    </Suspense>
  );
}