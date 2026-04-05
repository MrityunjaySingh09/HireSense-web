# ArmorClaw — Resume Truth Engine

A Next.js 14 (App Router) HR dashboard that verifies candidate resumes
against real-world evidence and produces a single **Trust Score**.

---

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Project Structure

```
src/
  app/
    page.js                        # Home — hero, stats, how-it-works
    layout.js                      # Root layout with sidebar
    globals.css                    # Fonts, base styles, animations
    verification/
      page.js                      # Upload + terminal + results
    ledger/
      page.js                      # History table (localStorage)
    about/
      page.js                      # Team + inspiration
    api/
      analyze/
        route.js                   # POST /api/analyze  (submit files)
      status/
        [id]/
          route.js                 # GET  /api/status/:id (poll result)
  components/
    layout/
      Sidebar.js                   # Fixed sidebar + mobile tab bar
      TopBar.js                    # Breadcrumb + live clock
    verification/
      DropZone.js                  # PDF drag-and-drop upload
      Terminal.js                  # Animated terminal loader
    results/
      ResultsPanel.js              # Full results layout
      TrustGauge.js                # SVG semicircle gauge
      ForensicsBar.js              # Animated skill bars
  lib/
    mockData.js                    # Mock response data (swap for real API)
```

---

## Connecting the Real Backend

### Step 1 — Set environment variable

Copy `.env.local.example` to `.env.local` and fill in your FastAPI URL:

```
BACKEND_URL=http://localhost:8000
```

### Step 2 — Update `POST /api/analyze`

Open `src/app/api/analyze/route.js` and replace the mock block:

```js
// REMOVE mock block and replace with:
const res  = await fetch(`${process.env.BACKEND_URL}/analyze`, {
  method: 'POST',
  body:   formData,     // resume + jd already in formData
})
const data = await res.json()
return NextResponse.json(data)
```

Expected backend response:
```json
{ "candidate_id": "uuid-abc123", "status": "processing" }
```

### Step 3 — Update `GET /api/status/:id`

Open `src/app/api/status/[id]/route.js` and replace the mock block:

```js
// REMOVE mock block and replace with:
const res  = await fetch(`${process.env.BACKEND_URL}/status/${id}`)
const data = await res.json()
return NextResponse.json(data)
```

Expected backend response shape (when completed):
```json
{
  "candidate_id": "uuid-abc123",
  "status": "completed",
  "summary": {
    "role_classification": "Backend Developer",
    "primary_skills": ["Python", "FastAPI", "PostgreSQL"]
  },
  "scores": {
    "trust_score": 88,
    "jd_match": 75,
    "confidence_level": "high"
  },
  "code_forensics": [
    { "skill": "Python", "percent": 68, "evidence": "verified in 12 files" }
  ],
  "assessments": {
    "strengths": ["Strong GitHub activity"],
    "risk_factors": ["No cloud config found"]
  },
  "interview_questions": [
    "Can you walk us through your last cloud deployment?"
  ]
}
```

The frontend polls every 2 seconds until `status === "completed"`.
If `code_forensics` is absent, the forensics section is hidden automatically.

---

## Mock Data

All mock data lives in `src/lib/mockData.js`. The shape exactly mirrors the
API contract above. When you switch to the real backend, this file can be
kept as a test fixture.

---

## Tech Stack

- **Next.js 14** — App Router, pure JavaScript
- **Tailwind CSS** — all styling
- **Lucide React** — icons
- **JetBrains Mono + Space Grotesk** — Google Fonts
- **localStorage** — ledger history persistence
# HireSense-web
