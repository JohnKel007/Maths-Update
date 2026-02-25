import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const units = await prisma.unit.findMany({
    where: { teacherId: session.user.id },
    include: {
      phenomenon: true,
      drivingQuestion: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(units)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const unit = await prisma.unit.create({
    data: {
      teacherId: session.user.id,
      title: body.title,
      yearGroup: body.yearGroup,
      duration: body.duration,
      interdisciplinaryConnections: body.interdisciplinaryConnections || null,
    },
  })

  return NextResponse.json(unit, { status: 201 })
}
