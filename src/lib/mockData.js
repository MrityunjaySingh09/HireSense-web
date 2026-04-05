// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — Replace with real API responses when backend is ready
// Shape matches /api/analyze and /api/status/:id response contracts exactly
// ─────────────────────────────────────────────────────────────────────────────

export const mockAnalysis = {
  candidate_id: 'uuid-12345',
  status: 'completed',
  summary: {
    role_classification: 'Backend Developer',
    primary_skills: ['Python', 'FastAPI', 'PostgreSQL'],
  },
  scores: {
    trust_score: 88,
    jd_match: 75,
    confidence_level: 'high',
  },
  code_forensics: [
    { skill: 'Python',     percent: 68, evidence: 'verified in 12 files' },
    { skill: 'FastAPI',    percent: 55, evidence: 'verified in 8 files'  },
    { skill: 'PostgreSQL', percent: 40, evidence: 'verified in 4 files'  },
    { skill: 'Docker',     percent: 8,  evidence: 'not found'             },
  ],
  assessments: {
    strengths: [
      'Strong GitHub activity with 40+ commits in last 90 days',
      'Consistent project depth across 3 verified repos',
      'FastAPI usage confirmed in 8 files',
      'PostgreSQL integration found in 2 production projects',
    ],
    risk_factors: [
      'No public cloud credentials or AWS config found',
      'Discrepancy in employment dates (2021-2022 gap)',
      'ML skills listed but no ML code found in GitHub',
    ],
  },
  interview_questions: [
    'You mentioned AWS expertise, but your public repos are mostly Python scripts. Can you describe your last cloud deployment in detail?',
    'Can you walk us through the architecture of the FastAPI project verified via OpenClaw?',
    'Your resume lists a senior role from 2021-2022, but we could not verify output from that period. Can you explain?',
  ],
}

export const mockHistory = [
  {
    id: 'uuid-12345',
    role: 'Backend Developer',
    trust_score: 88,
    jd_match: 75,
    status: 'completed',
    date: '2024-04-03 14:22',
  },
  {
    id: 'uuid-67890',
    role: 'Frontend Engineer',
    trust_score: 62,
    jd_match: 58,
    status: 'completed',
    date: '2024-04-02 09:15',
  },
  {
    id: 'uuid-11223',
    role: 'ML Engineer',
    trust_score: 41,
    jd_match: 33,
    status: 'completed',
    date: '2024-04-01 17:40',
  },
]
