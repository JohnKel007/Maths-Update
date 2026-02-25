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

  const dq = await prisma.drivingQuestion.upsert({
    where: { unitId: params.unitId },
    create: {
      unitId: params.unitId,
      candidates: body.candidates || [],
      selectedQuestion: body.selectedQuestion,
      customStem: body.customStem,
    },
    update: {
      candidates: body.candidates || [],
      selectedQuestion: body.selectedQuestion,
      customStem: body.customStem,
    },
  })

  return NextResponse.json(dq)
}
