'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { AnimatedIntro } from '@/components/AnimatedIntro'
import { ClientRenderer } from './ClientRenderer'

export const PortfolioGalleryBlock = async ({
  id,
  introContent,
  limit: limitFromProps,
  replaceLoadMoreWithLink,
}: PortfolioGalleryBlock & { id?: string }) => {
  const cookieStore = cookies()
  const search = cookieStore.get('next-url')?.value
  const searchParams = new URLSearchParams(search)
  const urlSlug = searchParams.get('cat') ?? ''

  const payload = await getPayload({ config: configPromise })

  const categoriesRes = await payload.find({
    collection: 'portfolio-categories',
    limit: 100,
  })

  const activeCategory = categoriesRes.docs.find((cat) => cat.slug === urlSlug)
  const categoryId = activeCategory?.id
  const limit = typeof limitFromProps === 'number' ? limitFromProps : 12

  const fetched = await payload.find({
    collection: 'portfolio',
    where: categoryId ? { categories: { in: [categoryId] } } : {},
    limit,
    depth: 1,
    page: 1,
  })

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && <AnimatedIntro introContent={introContent} />}
      <ClientRenderer
        initialItems={fetched.docs}
        initialTotalDocs={fetched.totalDocs}
        categories={categoriesRes.docs.map((cat) => ({
          id: String(cat.id),
          slug: cat.slug,
          title: cat.title,
        }))}
        categoryId={categoryId}
        replaceLoadMoreWithLink={replaceLoadMoreWithLink}
        limit={limit}
      />
    </div>
  )
}
