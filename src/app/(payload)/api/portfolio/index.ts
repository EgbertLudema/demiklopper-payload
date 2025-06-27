// ✅ src/app/(payload)/api/portfolio/route.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const categoryId = searchParams.get('categoryId')
  const limit = parseInt(searchParams.get('limit') || '6', 10)

  const payload = await getPayload({ config: configPromise })

  const where = categoryId ? { categories: { in: [categoryId] } } : {}

  const result = await payload.find({
    collection: 'portfolio',
    where,
    depth: 1,
    limit,
    page,
  })

  const { docs, totalDocs } = result

  return NextResponse.json({ docs, totalDocs, limit, page })
}
