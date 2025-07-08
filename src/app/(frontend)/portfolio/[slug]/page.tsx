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

  console.log('portfolio', portfolio)

  if (!portfolio) return <PayloadRedirects url={url} />

  return (
    <article>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <PortfolioHero portfolio={portfolio} />

      {/* Content block */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Prominente afbeelding */}
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

          {/* Project info en download */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Tekst en details - links */}
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
                        <span className="text-gray-600">Jaar:</span>
                        <span className="font-medium">
                          {new Date(portfolio.publishedOn).getFullYear()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Download knop - rechts */}
              {portfolio.image &&
                typeof portfolio.image === 'object' &&
                'url' in portfolio.image && (
                  <div className="flex justify-center lg:justify-end">
                    <DownloadButton
                      imageUrl={portfolio.image.url ?? ''}
                      title={portfolio.title || ''}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      {/* Add related posts using category */}
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
