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

  const mapping = await prisma.mathsMapping.upsert({
    where: { unitId: params.unitId },
    create: {
      unitId: params.unitId,
      strands: body.strands || [],
      skills: body.skills || [],
      processes: body.processes || [],
      cognitiveDemand: body.cognitiveDemand || 'both',
      priorKnowledge: body.priorKnowledge,
      vocabulary: body.vocabulary || [],
      extension: body.extension,
      cambridgeObjectives: body.cambridgeObjectives,
    },
    update: {
      strands: body.strands || [],
      skills: body.skills || [],
      processes: body.processes || [],
      cognitiveDemand: body.cognitiveDemand || 'both',
      priorKnowledge: body.priorKnowledge,
      vocabulary: body.vocabulary || [],
      extension: body.extension,
      cambridgeObjectives: body.cambridgeObjectives,
    },
  })

  return NextResponse.json(mapping)
}
