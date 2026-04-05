'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Zap, ShieldCheck, ScrollText, Users } from 'lucide-react'

const NAV = [
  { label: 'Home',         href: '/',            icon: Zap         },
  { label: 'Verification', href: '/verification', icon: ShieldCheck },
  { label: 'Ledger',       href: '/ledger',       icon: ScrollText  },
  { label: 'About Us',     href: '/about',        icon: Users       },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  const active = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="fixed top-0 left-0 bottom-0 w-[220px] flex flex-col z-50"
        style={{ background: '#0A0A0A', borderRight: '1px solid #1A1A1A' }}
      >
        {/* Logo */}
        <div className="px-4 pt-6 pb-0">
          <div className="flex items-center gap-2">
            <span
              className="w-[6px] h-[6px] rounded-full flex-shrink-0"
              style={{ background: '#22C55E' }}
            />
            <span
              className="font-sans font-bold text-[14px] text-[#F5F5F5]"
              style={{ letterSpacing: '0.12em' }}
            >
              HIRE SENSE
            </span>
          </div>
          <p
            className="font-mono text-[9px] text-[#444] mt-1"
            style={{ letterSpacing: '0.1em' }}
          >
                RESUME TRUTH ENGINE
          </p>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#1A1A1A] my-4 mx-0" />

        {/* Nav */}
        <nav className="flex flex-col">
          {NAV.map(({ label, href, icon: Icon }) => {
            const isActive = active(href)
            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className="flex items-center w-full text-left transition-colors duration-150"
                style={{
                  padding: '10px 16px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? '#F5F5F5' : '#555',
                  background: isActive ? '#111' : 'transparent',
                  borderLeft: `2px solid ${isActive ? '#22C55E' : 'transparent'}`,
                  cursor: 'pointer',
                  border: 'none',
                  borderLeft: `2px solid ${isActive ? '#22C55E' : 'transparent'}`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#F5F5F5'
                    e.currentTarget.style.background = '#111'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#555'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <Icon size={15} style={{ marginRight: '10px', flexShrink: 0 }} />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Bottom status */}
        {/* <div className="mt-auto px-4 pb-6">
          <div className="h-[1px] bg-[#1A1A1A] mb-4" />
          <p
            className="font-mono text-[9px] text-[#444] mb-2"
            style={{ letterSpacing: '0.1em' }}
          >
            NODE_STATUS
          </p>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-[6px] h-[6px] rounded-full"
              style={{ background: '#22C55E' }}
            />
            <span
              className="font-mono text-[10px]"
              style={{ color: '#22C55E' }}
            >
              OPERATIONAL
            </span>
          </div>
          <p className="font-mono text-[9px] text-[#333]">v1.0.0</p>
        </div> */}
      </aside>

      {/* ── Mobile bottom tab bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center sm:hidden"
        style={{
          background: '#0A0A0A',
          borderTop: '1px solid #1A1A1A',
          height: '60px',
        }}
      >
        {NAV.map(({ href, icon: Icon }) => {
          const isActive = active(href)
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="flex flex-col items-center justify-center p-3"
              style={{
                color: isActive ? '#22C55E' : '#555',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderTop: `2px solid ${isActive ? '#22C55E' : 'transparent'}`,
              }}
            >
              <Icon size={20} />
            </button>
          )
        })}
      </nav>
    </>
  )
}
