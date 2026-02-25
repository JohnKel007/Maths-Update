import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { unitId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const phenomenon = await prisma.phenomenon.upsert({
    where: { unitId: params.unitId },
    create: {
      unitId: params.unitId,
      statement: body.statement,
      localRelevance: body.localRelevance,
      whyItMatters: body.whyItMatters,
      studentQuestions: body.studentQuestions,
      mathsDemanded: body.mathsDemanded,
      subjectLinks: body.subjectLinks,
      experienceMethod: body.experienceMethod,
      isObservable: body.checklist?.observable ?? false,
      generatesQuestions: body.checklist?.generatesQuestions ?? false,
      demandsMaths: body.checklist?.demandsMaths ?? false,
      locallyRelevant: body.checklist?.locallyRelevant ?? false,
      appropriatelyComplex: body.checklist?.appropriatelyComplex ?? false,
      isInterdisciplinary: body.checklist?.interdisciplinary ?? false,
      isAgeAppropriate: body.checklist?.ageAppropriate ?? false,
    },
    update: {
      statement: body.statement,
      localRelevance: body.localRelevance,
      whyItMatters: body.whyItMatters,
      studentQuestions: body.studentQuestions,
      mathsDemanded: body.mathsDemanded,
      subjectLinks: body.subjectLinks,
      experienceMethod: body.experienceMethod,
      isObservable: body.checklist?.observable ?? false,
      generatesQuestions: body.checklist?.generatesQuestions ?? false,
      demandsMaths: body.checklist?.demandsMaths ?? false,
      locallyRelevant: body.checklist?.locallyRelevant ?? false,
      appropriatelyComplex: body.checklist?.appropriatelyComplex ?? false,
      isInterdisciplinary: body.checklist?.interdisciplinary ?? false,
      isAgeAppropriate: body.checklist?.ageAppropriate ?? false,
    },
  })

  return NextResponse.json(phenomenon)
}
