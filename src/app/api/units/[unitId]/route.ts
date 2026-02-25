import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: { unitId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const unit = await prisma.unit.findUnique({
    where: { id: params.unitId },
    include: {
      phenomenon: true,
      mathsMapping: true,
      drivingQuestion: true,
      learningArcs: true,
      toolAssignments: true,
      assessmentPlans: true,
      facilitationPlan: true,
    },
  })

  if (!unit) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(unit)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { unitId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const unit = await prisma.unit.update({
    where: { id: params.unitId },
    data: {
      title: body.title,
      yearGroup: body.yearGroup,
      duration: body.duration,
      interdisciplinaryConnections: body.interdisciplinaryConnections,
      status: body.status,
    },
  })

  return NextResponse.json(unit)
}
