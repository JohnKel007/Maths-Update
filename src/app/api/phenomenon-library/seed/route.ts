import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const SEED_PHENOMENA = [
  {
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
  },
  {
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
  },
  {
    title: 'Market Stall Profit',
    statement: 'Students plan and run a real (or simulated) market stall at the school fair, calculating costs, setting prices, tracking sales, and analysing profit margins using addition, multiplication, percentages, and budgeting.',
    tags: ['Mexico City', 'community', 'entrepreneurship', 'practical'],
    strands: ['number', 'fractions'],
    skills: ['Addition', 'Multiplication', 'Percentages', 'Budgeting', 'Profit and loss'],
    drivingQuestions: [
      'How can we make the most profit from a market stall at our school fair?',
      'What prices should we set to cover costs and make a good profit?',
    ],
    ageRange: 'Year 4-6',
    interdisciplinary: ['Business studies', 'PSHE', 'Spanish language (persuasion)'],
  },
  {
    title: 'Mexico City Travel Times',
    statement: 'Getting around Mexico City takes very different amounts of time depending on where, when, and how you travel. Students collect and compare real travel data, investigating time, distance, and averages to find patterns.',
    tags: ['Mexico City', 'urban environment', 'transport', 'daily life'],
    strands: ['statistics', 'number'],
    skills: ['Time', 'Distance', 'Data comparison', 'Averages (mean)', 'Data representation'],
    drivingQuestions: [
      'What is the fastest way to get to school, and does it depend on when you leave?',
      'How do travel times compare across different parts of Mexico City?',
    ],
    ageRange: 'Year 4-6',
    interdisciplinary: ['Geography', 'Science (environment/pollution)', 'Citizenship'],
  },
  {
    title: 'Vertical Garden',
    statement: 'Our school wants to grow a vertical garden on a wall. Students must calculate planting areas using arrays and multiplication, estimate soil and water needs, and plan the layout to maximise growing space.',
    tags: ['school community', 'sustainability', 'Mexico City', 'nature'],
    strands: ['geometry', 'number'],
    skills: ['Area', 'Arrays', 'Multiplication', 'Estimation', 'Measurement'],
    drivingQuestions: [
      'How can we design a vertical garden that grows the most food in the smallest space?',
      'How many plants can we fit on our school wall, and how much will they produce?',
    ],
    ageRange: 'Year 2-4',
    interdisciplinary: ['Science (plants/biology)', 'Design & Technology', 'Environmental studies'],
  },
  {
    title: 'School Resource Distribution',
    statement: 'Is the distribution of resources (books, computers, sports equipment) across classes in our school fair? Students collect and analyse data using ratio, fractions, and proportional thinking to evaluate and propose fair distribution.',
    tags: ['school community', 'fairness', 'social justice'],
    strands: ['fractions', 'statistics'],
    skills: ['Ratio', 'Fractions', 'Data collection', 'Proportional thinking', 'Data representation'],
    drivingQuestions: [
      'Is it fair how resources are shared between classes in our school?',
      'How should we distribute school resources so that every class gets a fair share?',
    ],
    ageRange: 'Year 4-6',
    interdisciplinary: ['PSHE (fairness/justice)', 'Citizenship', 'English (persuasive writing)'],
  },
]

export async function POST() {
  // Only allow in development or if no phenomena exist
  const existingCount = await prisma.phenomenonLibrary.count()

  if (existingCount > 0) {
    return NextResponse.json(
      { message: 'Seed data already exists', count: existingCount },
      { status: 200 }
    )
  }

  const created = await prisma.phenomenonLibrary.createMany({
    data: SEED_PHENOMENA.map((p) => ({
      ...p,
      approved: true,
    })),
  })

  return NextResponse.json(
    { message: 'Seed data created', count: created.count },
    { status: 201 }
  )
}
