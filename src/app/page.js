"use client";

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Upload, Cpu, BarChart2,
  ShieldCheck, Target, Layers, AlertTriangle, FileText,
} from 'lucide-react'
import TopBar from '@/components/layout/TopBar'

const STEPS = [
  { num: '01', icon: Upload,    title: 'Upload Resume + JD',  desc: 'Drop your candidate resume and job description PDF.'         },
  { num: '02', icon: Cpu,       title: 'Hire Sense Scans',     desc: 'Cross-references skills, GitHub, and employment history.'    },
  { num: '03', icon: BarChart2, title: 'Get Trust Score',     desc: 'Receive a 0-100 verified trust score with full breakdown.'   },
]

const FEATURES = [
  { icon: ShieldCheck,   title: 'Code Auditor',    desc: 'Scans GitHub repos for real skill usage'             },
  { icon: Target,        title: 'JD Matcher',      desc: 'Matches resume against job description'              },
  { icon: BarChart2,     title: 'Trust Score',     desc: 'Single 0-100 verification score'                    },
  { icon: Layers,        title: 'Skill Depth',     desc: 'Detects keyword stuffing vs real usage'             },
  { icon: AlertTriangle, title: 'Fraud Detector',  desc: 'Flags suspicious resume patterns'                   },
  { icon: FileText,      title: 'HR Summary',      desc: 'Auto-generates candidate briefing'                  },
]

const PROTOCOLS = [
  "Next.js 15", "OpenClaw", "ArmorClaw", "Rust", "Python", "Gemini 1.5", 
  "GitHub API", "TypeScript", "Docker", "AWS", "PostgreSQL", "Tailwind v4",
  "Framer Motion", "Node.js", "Redis", "PyTorch", "Kubernetes", "GraphQL", 
  "FastAPI", "MongoDB", "TensorFlow"
];

function FloatingMesh() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-visible">
      {/* 1. Subtle Background Grid (Optional, very faint) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#050505 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="relative flex flex-wrap justify-center gap-4 max-w-[550px] z-10">
        {PROTOCOLS.map((text, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0.4, 0.8, 0.4],
              y: [0, i % 2 === 0 ? -20 : 20, 0],
              x: [0, i % 3 === 0 ? 15 : -15, 0]
            }}
            transition={{
              duration: 4 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
            className="px-4 py-2 border border-[#E5E5E5] bg-white/50 backdrop-blur-sm rounded-[2px] font-mono text-[10px] text-[#050505] shadow-sm uppercase tracking-widest font-bold"
          >
            {text}
          </motion.div>
        ))}
        
        {/* 2. The Floating Green Scanner Line */}
        <motion.div 
          animate={{ 
            top: ['-10%', '80%'],
            opacity: [0, 1, 1, 0] 
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute left-[-0%] w-[100%] h-[2px] bg-[#22C55E] shadow-[0_0_15px_#22C55E] opacity-40 z-20 pointer-events-none"
        />
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen overflow-x-hidden">
      <TopBar breadcrumb="HIRESENSE / HOME" />

      {/* Hero Section */}
      <section className="mb-24 mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="z-30"
        >
          <h1
            className="font-sans font-extrabold text-[72px] leading-[0.8] uppercase text-[#050505] mb-8"
            style={{ letterSpacing: '-4px' }}
          >
            Verify Before<br />You Hire.
          </h1>
          <div className="w-[120px] h-[6px] bg-[#22C55E] mb-10" />
          <p
            className="font-mono text-[16px] text-[#444] max-w-[500px] mb-12"
            style={{ lineHeight: 1.8 }}
          >
           A multi-agent system that goes beyond traditional ATS by actively verifying resumes and candidate data, generating real-time trust scores, risk insights, and interview questions.
          </p>
          <Link href="/verification">
            <button
              className="font-sans font-bold text-[14px] uppercase text-white bg-[#050505] rounded-[4px] px-16 py-6 transition-all hover:bg-[#22C55E] hover:shadow-2xl active:scale-95 shadow-lg shadow-black/10"
              style={{ letterSpacing: '0.25em' }}
            >
              START VERIFICATION →
            </button>
          </Link>
        </motion.div>

        {/* 3. The Floating Tech Mesh (No Canvas) */}
        <div className="hidden lg:block relative h-full w-full">
           <FloatingMesh />
        </div>
      </section>

      {/* How it works */}
      <SectionLabel>HOW IT WORKS</SectionLabel>
      <div className="grid grid-cols-3 gap-8 mb-24 max-sm:grid-cols-1">
        {STEPS.map(({ num, icon: Icon, title, desc }) => (
          <div
            key={num}
            className="bg-white rounded-[4px] p-10 border border-[#EEE] transition-all hover:border-[#22C55E] hover:shadow-xl group"
          >
            <div className="font-sans font-extrabold text-[56px] leading-none mb-6 text-[#F0F0F0] group-hover:text-[#F0FDF4] transition-colors">
              {num}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#F0FDF4] rounded-[4px]">
                <Icon size={22} className="text-[#22C55E]" />
              </div>
              <span className="font-sans font-bold text-[18px] text-[#050505]">{title}</span>
            </div>
            <p className="font-mono text-[13px] text-[#666] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <SectionLabel>WHAT WE VERIFY</SectionLabel>
      <div className="grid grid-cols-3 gap-8 mb-16 max-sm:grid-cols-1 max-md:grid-cols-2">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-[4px] p-10 border border-[#EEE] flex flex-col items-start transition-all hover:shadow-lg"
          >
            <Icon size={24} className="text-[#22C55E] mb-6" />
            <div className="font-sans font-bold text-[16px] text-[#050505] mb-3">{title}</div>
            <p className="font-mono text-[12px] text-[#737373] leading-normal">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p
      className="font-mono text-[12px] uppercase text-[#BDBDBD] mb-12 font-bold"
      style={{ letterSpacing: '0.45em' }}
    >
      {children}
    </p>
  )
}