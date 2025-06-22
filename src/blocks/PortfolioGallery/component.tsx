import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { PortfolioGalleryBlock } from '@/payload-types'
import { CollectionArchive } from '@/components/CollectionArchivePortfolio'
import RichText from '@/components/RichText'

export const PortfolioGalleryBlock = async ({
  id,
  introContent,
  limit: limitFromProps,
}: PortfolioGalleryBlock & { id?: string }) => {
  const cookieStore = cookies()
  const search = cookieStore.get('next-url')?.value
  const searchParams = new URLSearchParams(search)
  const urlSlug = searchParams.get('cat') ?? ''

  const payload = await getPayload({ config: configPromise })

  // Fetch all categories to resolve the slug
  const categoriesRes = await payload.find({
    collection: 'portfolio-categories',
    limit: 100,
  })

  const activeCategory = categoriesRes.docs.find((cat) => cat.slug === urlSlug)
  const categoryId = activeCategory?.id

  const limit = typeof limitFromProps === 'number' ? limitFromProps : 12

  const where = categoryId
    ? {
        categories: { in: [categoryId] },
      }
    : {}

  const fetched = await payload.find({
    collection: 'portfolio',
    where,
    limit,
    depth: 1,
  })

  const items = fetched.docs

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive
        items={fetched.docs}
        categories={categoriesRes.docs.map((cat) => ({
          ...cat,
          id: String(cat.id),
        }))}
      />
    </div>
  )
}
