import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const strand = searchParams.get('strand')
  const ageRange = searchParams.get('ageRange')
  const tag = searchParams.get('tag')
  const search = searchParams.get('search')

  const where: Record<string, unknown> = {
    approved: true,
  }

  if (strand) {
    where.strands = { has: strand }
  }

  if (ageRange) {
    where.ageRange = ageRange
  }

  if (tag) {
    where.tags = { has: tag }
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { statement: { contains: search, mode: 'insensitive' } },
    ]
  }

  const phenomena = await prisma.phenomenonLibrary.findMany({
    where,
    include: {
      ratings: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate average rating
  const withAverages = phenomena.map((p) => ({
    ...p,
    averageRating:
      p.ratings.length > 0
        ? p.ratings.reduce((sum, r) => sum + r.stars, 0) / p.ratings.length
        : 0,
    ratingCount: p.ratings.length,
  }))

  return NextResponse.json(withAverages)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const isAdmin = session.user.role === 'admin'

  const phenomenon = await prisma.phenomenonLibrary.create({
    data: {
      title: body.title,
      statement: body.statement,
      tags: body.tags || [],
      strands: body.strands || [],
      skills: body.skills || [],
      drivingQuestions: body.drivingQuestions || [],
      ageRange: body.ageRange || 'Year 3-6',
      interdisciplinary: body.interdisciplinary || [],
      submittedById: session.user.id,
      approved: isAdmin, // Auto-approve if admin
    },
  })

  return NextResponse.json(phenomenon, { status: 201 })
}
