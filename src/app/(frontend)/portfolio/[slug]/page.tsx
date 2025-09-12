import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PortfolioHero } from '@/heros/PortfolioHero'
import Image from 'next/image'
import { DownloadButton } from '@/components/ui/downloadButton'
import { RelatedPortfolioSlider } from '@/components/RelatedPortfolioSlider'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'portfolio',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/portfolio/' + slug
  const portfolio = await queryPostBySlug({ slug })

  if (!portfolio) return <PayloadRedirects url={url} />

  const relatedItems = await fetchRelatedItems({
    categories: portfolio?.categories ?? [],
    currentId: portfolio?.id ? String(portfolio.id) : '',
  })

  return (
    <article>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <PortfolioHero portfolio={portfolio} />

      {/* Content section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Featured image */}
          {portfolio.image && typeof portfolio.image === 'object' && 'url' in portfolio.image && (
            <div className="mb-12">
              <Image
                width={1200}
                height={1000}
                src={portfolio.image.url || ''}
                alt={portfolio.title || ''}
                className="w-full object-cover rounded-xl shadow-2xl"
              />
            </div>
          )}

          {/* Project info and download */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Text and details - left */}
              <div className="lg:col-span-2 space-y-6">
                {portfolio.content ? (
                  <div className="text-gray-700 text-lg">
                    <RichText enableGutter={false} data={portfolio.content} />
                  </div>
                ) : (
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Geen beschrijving beschikbaar.
                  </p>
                )}

                <div className="bg-gray-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                  <div className="space-y-3">
                    {(portfolio.categories ?? []).length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {(portfolio.categories?.length ?? 0) > 1 ? 'Categorieën:' : 'Categorie:'}
                        </span>

                        <span className="font-medium">
                          {(portfolio.categories ?? [])
                            .map((cat: any) => (typeof cat === 'object' ? cat.title : 'Onbekend'))
                            .join(', ')}
                        </span>
                      </div>
                    )}

                    {portfolio.publishedOn && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Datum:</span>
                        <span className="font-medium">
                          {new Date(portfolio.publishedOn).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'long',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Download button - right (conditional on showDownloadButton) */}
              {portfolio.showDownloadButton &&
                portfolio.image &&
                typeof portfolio.image === 'object' &&
                'url' in portfolio.image &&
                portfolio.image.url && (
                  <div className="flex justify-center lg:justify-end">
                    <DownloadButton imageUrl={portfolio.image.url} title={portfolio.title || ''} />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      {/* Related posts by category */}
      <RelatedPortfolioSlider items={relatedItems} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'portfolio',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const fetchRelatedItems = cache(
  async ({ categories, currentId }: { categories: any[]; currentId: string }) => {
    if (!categories.length) return []

    const payload = await getPayload({ config: configPromise })

    const categoryIds = categories.map((cat) => (typeof cat === 'object' ? cat.id : cat))

    const result = await payload.find({
      collection: 'portfolio',
      where: {
        id: { not_equals: currentId },
        categories: {
          in: categoryIds,
        },
      },
      limit: 3,
      depth: 1,
      draft: false,
      pagination: false,
    })

    return result.docs.map((doc) => ({
      id: doc.id ? String(doc.id) : '',
      slug: doc.slug ? String(doc.slug) : '',
      title: doc.title,
      publishedOn: doc.publishedOn ?? '',
      categories: doc.categories ?? [],
      meta: {
        image: doc.meta?.image ?? doc.image ?? null,
      },
    }))
  },
)
