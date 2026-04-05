import { NextResponse } from 'next/server'
import { mockAnalysis } from '@/lib/mockData'

export async function GET(request, { params }) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'candidate_id is required.' }, { status: 400 })
  }

  // ── Real backend ──────────────────────────────────────────────────────────
  // Uncomment once BACKEND_URL is set in .env.local
  // try {
  //   const res = await fetch(`${process.env.BACKEND_URL}/status/${id}`)
  //   if (!res.ok) {
  //     const body = await res.json().catch(() => ({}))
  //     return NextResponse.json(
  //       { error: body.detail ?? `Backend error (${res.status})` },
  //       { status: res.status }
  //     )
  //   }
  //   const data = await res.json()
  //   return NextResponse.json(data)
  // } catch (err) {
  //   console.error('[GET /api/status/:id]', err)
  //   return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  // }
  // ── END real backend ──────────────────────────────────────────────────────

  // ── MOCK ──────────────────────────────────────────────────────────────────
  return NextResponse.json({
    ...mockAnalysis,
    candidate_id: id,
    status: 'completed',
  })
  // ── END MOCK ──────────────────────────────────────────────────────────────
}