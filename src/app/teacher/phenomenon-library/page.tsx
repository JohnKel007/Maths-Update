'use client'

import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { MultiSelect } from '@/components/ui/MultiSelect'

interface PhenomenonItem {
  id: string
  title: string
  statement: string
  tags: string[]
  strands: string[]
  skills: string[]
  drivingQuestions: string[]
  ageRange: string
  interdisciplinary: string[]
  averageRating: number
  ratingCount: number
}

const STRAND_OPTIONS = [
  { value: 'number', label: 'Number' },
  { value: 'geometry', label: 'Geometry & Measure' },
  { value: 'statistics', label: 'Statistics' },
  { value: 'algebra', label: 'Algebra' },
  { value: 'fractions', label: 'Fractions, Decimals & %' },
]

const AGE_OPTIONS = [
  { value: 'Year 1-2', label: 'Year 1-2' },
  { value: 'Year 2-4', label: 'Year 2-4' },
  { value: 'Year 3-5', label: 'Year 3-5' },
  { value: 'Year 3-6', label: 'Year 3-6' },
  { value: 'Year 4-6', label: 'Year 4-6' },
]

// Seed data for client-side rendering when API is not available
const SEED_PHENOMENA: PhenomenonItem[] = [
  {
    id: 'seed-1',
    title: 'School Water Waste',
    statement: 'Our school uses thousands of litres of water every week, but how much is actually wasted? Students investigate water consumption patterns across the school, measuring tap flow rates, calculating daily waste, and proposing cost-effective solutions.',
    tags: ['Mexico City', 'school community', 'sustainability', 'urban environment'],
    strands: ['number', 'statistics'],
    skills: ['Measurement', 'Multiplication', 'Data collection', 'Money calculations'],
    drivingQuestions: [
      'How much water does our school waste each week, and what would it cost to fix?',
      'How could we reduce our school\'s water waste by 50%?',
    ],
    ageRange: 'Year 3-6',
    interdisciplinary: ['Science (water cycle)', 'Geography (local water systems)', 'Citizenship'],
    averageRating: 0,
    ratingCount: 0,
  },
  {
    id: 'seed-2',
    title: 'Classroom Redesign',
    statement: 'Our classroom could be better organised for learning. Students measure the room, create scale drawings, and propose new layouts using area, fractions, and proportional reasoning to justify their designs.',
    tags: ['school community', 'design', 'practical'],
    strands: ['geometry', 'fractions'],
    skills: ['Area', 'Fractions', 'Scale drawing', 'Proportional reasoning'],
    drivingQuestions: [
      'What is the best way to redesign our classroom so everyone can learn better?',
      'How can we use maths to prove our classroom design is the best option?',
    ],
    ageRange: 'Year 3-5',
    interdisciplinary: ['Design & Technology', 'Art', 'PSHE'],
    averageRating: 0,
    ratingCount: 0,
  },
  {
    id: 'seed-3',
    title: 'Market Stall Profit',
    statement: 'Students plan and run a real (or simulated) market stall at the school fair, calculating costs, setting prices, tracking sales, and analysing profit margins.',
    tags: ['Mexico City', 'community', 'entrepreneurship', 'practical'],
    strands: ['number', 'fractions'],
    skills: ['Addition', 'Multiplication', 'Percentages', 'Budgeting', 'Profit and loss'],
    drivingQuestions: [
      'How can we make the most profit from a market stall at our school fair?',
      'What prices should we set to cover costs and make a good profit?',
    ],
    ageRange: 'Year 4-6',
    interdisciplinary: ['Business studies', 'PSHE', 'Spanish language (persuasion)'],
    averageRating: 0,
    ratingCount: 0,
  },
  {
    id: 'seed-4',
    title: 'Mexico City Travel Times',
    statement: 'Getting around Mexico City takes very different amounts of time depending on where, when, and how you travel. Students collect and compare real travel data.',
    tags: ['Mexico City', 'urban environment', 'transport', 'daily life'],
    strands: ['statistics', 'number'],
    skills: ['Time', 'Distance', 'Data comparison', 'Averages (mean)', 'Data representation'],
    drivingQuestions: [
      'What is the fastest way to get to school, and does it depend on when you leave?',
      'How do travel times compare across different parts of Mexico City?',
    ],
    ageRange: 'Year 4-6',
    interdisciplinary: ['Geography', 'Science (environment/pollution)', 'Citizenship'],
    averageRating: 0,
    ratingCount: 0,
  },
  {
    id: 'seed-5',
    title: 'Vertical Garden',
    statement: 'Our school wants to grow a vertical garden on a wall. Students must calculate planting areas using arrays and multiplication, estimate soil and water needs, and plan the layout.',
    tags: ['school community', 'sustainability', 'Mexico City', 'nature'],
    strands: ['geometry', 'number'],
    skills: ['Area', 'Arrays', 'Multiplication', 'Estimation', 'Measurement'],
    drivingQuestions: [
      'How can we design a vertical garden that grows the most food in the smallest space?',
      'How many plants can we fit on our school wall, and how much will they produce?',
    ],
    ageRange: 'Year 2-4',
    interdisciplinary: ['Science (plants/biology)', 'Design & Technology', 'Environmental studies'],
    averageRating: 0,
    ratingCount: 0,
  },
  {
    id: 'seed-6',
    title: 'School Resource Distribution',
    statement: 'Is the distribution of resources (books, computers, sports equipment) across classes in our school fair? Students collect and analyse data using ratio, fractions, and proportional thinking.',
    tags: ['school community', 'fairness', 'social justice'],
    strands: ['fractions', 'statistics'],
    skills: ['Ratio', 'Fractions', 'Data collection', 'Proportional thinking', 'Data representation'],
    drivingQuestions: [
      'Is it fair how resources are shared between classes in our school?',
      'How should we distribute school resources so that every class gets a fair share?',
    ],
    ageRange: 'Year 4-6',
    interdisciplinary: ['PSHE (fairness/justice)', 'Citizenship', 'English (persuasive writing)'],
    averageRating: 0,
    ratingCount: 0,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${
            star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function PhenomenonLibraryPage() {
  const { t } = useI18n()
  const [phenomena, setPhenomena] = useState<PhenomenonItem[]>(SEED_PHENOMENA)
  const [search, setSearch] = useState('')
  const [selectedStrands, setSelectedStrands] = useState<string[]>([])
  const [selectedAge, setSelectedAge] = useState('')

  // Try to fetch from API, fall back to seed data
  useEffect(() => {
    fetch('/api/phenomenon-library')
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error('API not available')
      })
      .then((data) => {
        if (data.length > 0) setPhenomena(data)
      })
      .catch(() => {
        // Use seed data — API may not be connected to a database yet
      })
  }, [])

  const filtered = useMemo(() => {
    return phenomena.filter((p) => {
      if (search) {
        const searchLower = search.toLowerCase()
        if (
          !p.title.toLowerCase().includes(searchLower) &&
          !p.statement.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }
      if (selectedStrands.length > 0) {
        if (!selectedStrands.some((s) => p.strands.includes(s))) {
          return false
        }
      }
      if (selectedAge && p.ageRange !== selectedAge) {
        return false
      }
      return true
    })
  }, [phenomena, search, selectedStrands, selectedAge])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('phenomenonLibrary.title')}
        </h1>
        <button className="btn-primary">
          + {t('phenomenonLibrary.submitNew')}
        </button>
      </div>

      {/* Filters */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('phenomenonLibrary.searchPlaceholder')}
              className="input-field"
            />
          </div>
          <select
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">{t('phenomenonLibrary.filterByAge')}</option>
            {AGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <MultiSelect
          label={t('phenomenonLibrary.filterByStrand')}
          options={STRAND_OPTIONS}
          selected={selectedStrands}
          onChange={setSelectedStrands}
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">{t('phenomenonLibrary.noResults')}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((phenomenon) => (
            <div key={phenomenon.id} className="card-hover space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {phenomenon.title}
                </h3>
                <StarRating rating={phenomenon.averageRating} />
              </div>

              <p className="text-sm text-gray-600 line-clamp-3">
                {phenomenon.statement}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {phenomenon.strands.map((strand) => (
                  <span
                    key={strand}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {STRAND_OPTIONS.find((s) => s.value === strand)?.label || strand}
                  </span>
                ))}
                {phenomenon.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {phenomenon.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Driving Questions */}
              {phenomenon.drivingQuestions.length > 0 && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Suggested driving questions:
                  </p>
                  {phenomenon.drivingQuestions.map((dq, i) => (
                    <p key={i} className="text-sm text-gray-700 italic">
                      &ldquo;{dq}&rdquo;
                    </p>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400">{phenomenon.ageRange}</span>
                <button className="btn-primary text-sm px-4 py-2">
                  {t('phenomenonLibrary.useThisPhenomenon')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
