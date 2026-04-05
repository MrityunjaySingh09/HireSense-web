// POST /api/analyze
// Accepts: multipart/form-data with fields: resume (File), jd (File)
// Returns: { candidate_id, status: 'processing' }
//
// ── TO CONNECT REAL BACKEND ──────────────────────────────────────────────────
// Replace the mock delay block below with:
//   const formData = new FormData()
//   formData.append('resume', resume)
//   formData.append('jd', jd)
//   const res = await fetch(`${process.env.BACKEND_URL}/analyze`, { method: 'POST', body: formData })
//   const data = await res.json()
//   return NextResponse.json(data)
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
                                                                                                                                                                                                                                                       
export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const resume = formData.get('resume')
    const jd = formData.get('jd')

    if (!resume || !jd) {
      return NextResponse.json(
        { error: 'Both resume and jd files are required.' },
        { status: 400 }
      )
    }

    // Validate file types
    if (!resume.name.endsWith('.pdf') || !jd.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are accepted.' },
        { status: 400 }
      )
    }

    // ── MOCK: simulate backend accepting the job ─────────────────────────────
    const candidate_id = 'uuid-' + Math.random().toString(36).slice(2, 7)
    // ── END MOCK ─────────────────────────────────────────────────────────────

    return NextResponse.json({
      candidate_id,
      status: 'processing',
      message: 'Scan initiated. Poll /api/status/:id for results.',
    })
  } catch (err) {
    console.error('[/api/analyze]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
