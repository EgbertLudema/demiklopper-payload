'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AnimatedIntro } from '@/components/AnimatedIntro'
import { ClientRenderer } from './ClientRenderer'
import type { PortfolioGalleryBlock as PortfolioGalleryBlockType } from '@/payload-types'

export const PortfolioGalleryBlock = async ({
  id,
  introContent,
  limit: limitFromProps,
  replaceLoadMoreWithLink,
}: PortfolioGalleryBlockType & { id?: string }) => {
  const cookieStore = cookies()
  const search = (await cookieStore).get('next-url')?.value
  const searchParams = new URLSearchParams(search)
  const urlSlug = searchParams.get('cat') ?? ''

  const payload = await getPayload({ config: configPromise })

  // Only fetch categories (for the filter buttons)
  const categoriesRes = await payload.find({
    collection: 'portfolio-categories',
    limit: 100,
  })

  const activeCategory = categoriesRes.docs.find((cat) => cat.slug === urlSlug)
  const categoryId = activeCategory?.id
  const limit = typeof limitFromProps === 'number' ? limitFromProps : 12

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && <AnimatedIntro introContent={introContent} />}
      <ClientRenderer
        initialTotalDocs={0}
        categories={categoriesRes.docs.map((cat) => ({
          id: String(cat.id),
          slug: cat.slug,
          title: cat.title,
        }))}
        categoryId={categoryId !== undefined ? String(categoryId) : undefined}
        replaceLoadMoreWithLink={replaceLoadMoreWithLink ?? undefined}
        limit={limit}
      />
    </div>
  )
}
