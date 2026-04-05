"use client";

import { Github, Linkedin } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'

const TEAM = [
  { initials: 'S', name: 'Soumyak', role: '', bio: 'Building autonomous systems that bring truth to hiring through zero-trust protocols.' },
  { initials: 'IS', name: 'Ishan', role: '',  bio: 'Passionate about building products that solve real problems. Loves pixel-perfect UI.' },
  { initials: 'AK', name: 'Akshat', role: '',   bio: 'FastAPI and Python specialist. Believes in systems that tell the truth.' },
  { initials: 'MS', name: 'Mrityunjay', role: '',        bio: 'LangChain and embeddings wizard. Turns raw text into verified signals.' },
]

const TECH = []

function SectionLabel({ children }) {
  return (
    <p
      className="font-mono text-[11px] uppercase text-[#999] mb-5"
      style={{ letterSpacing: '0.2em' }}
    >
      {children}
    </p>
  )
}

function SocialIcon({ icon: Icon }) {
  return (
    <span
      className="cursor-pointer transition-colors duration-150"
      style={{ color: '#A3A3A3' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#050505')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#A3A3A3')}
    >
      <Icon size={16} />
    </span>
  )
}

export default function AboutPage() {
  return (
    <div className="p-8 bg-white min-h-screen">
      <TopBar breadcrumb="HIRE SENSE/ ABOUT" />

      {/* Hero Section */}
      <section className="mb-10 mt-6">
        <h1
          className="font-sans font-extrabold text-[52px] leading-none uppercase text-[#050505]"
          style={{ letterSpacing: '-1px' }}
        >
          About<br />Hire Sense.
        </h1>
        <div className="w-[60px] h-[2px] bg-[#FF9F43] my-4" /> 
        <p
          className="font-mono text-[13px] text-[#525252] max-w-[560px]"
          style={{ lineHeight: 1.8 }}
        >
          Built for Hackbyte 4.0 
        </p>
      </section>

      {/* Inspiration */}
      <SectionLabel>THE INSPIRATION</SectionLabel>
      <div
        className="mb-10 rounded-[0_4px_4px_0]"
        style={{
          borderLeft: '4px solid #FF9F43',
          padding: '16px 24px',
          background: '#FAFAFA',
        }}
      >
        <p className="font-sans text-[18px] italic text-[#050505]" style={{ lineHeight: 1.6 }}>
          "Turning “invisible rejection” into verified recognition by evaluating real developer work instead of just resume keywords."
        </p>
        
      </div>

      {/* Team Section */}
      <SectionLabel>THE TEAM</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-10 max-sm:grid-cols-1">
        {TEAM.map(({ initials, name, role, bio }) => (
          <div
            key={name}
            className="bg-white rounded-[4px] p-5 flex gap-4 transition-all hover:border-[#FF9F43]"
            style={{ border: '1px solid #E0E0E0' }}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full font-sans font-bold text-[16px] text-[#525252]"
              style={{ width: 48, height: 48, background: '#EFEFEF' }}
            >
              {initials}
            </div>
            <div>
              <div className="font-sans font-bold text-[15px] text-[#050505]">{name}</div>
              <div className="font-mono text-[11px] text-[#777] mt-[2px]">{role}</div>
              <p className="font-mono text-[11px] text-[#999] mt-2" style={{ lineHeight: 1.6 }}>
                {bio}
              </p>
              <div className="flex gap-3 mt-3">
                <SocialIcon icon={Github} />
                <SocialIcon icon={Linkedin} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stack Section */}
      {/* <SectionLabel>BUILT WITH</SectionLabel> */}
      {/* <div className="flex flex-wrap gap-2">
        {TECH.map((t) => (
          <span
            key={t}
            className="font-mono text-[11px] text-[#525252] rounded-[2px]"
            style={{
              border: '1px solid #D4D4D4',
              background: '#FAFAFA',
              padding: '6px 14px',
            }}
          >
            {t}
          </span>
        ))}
      </div> */}
    </div>
  )
}