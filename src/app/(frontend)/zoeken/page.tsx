import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/CardPortfolio'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'portfolio',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      publishedOn: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24 bg-gray-100">
      <PageClient />
      <div className="container my-16 text-center">
        <div className="payload-richtext max-w-none mx-auto prose md:prose-md mb-4">
          <h1 className="">Zoeken</h1>
        </div>
        <p className="text-gray-600 mb-4">
          Opzoek naar een specifieke categorie, foto of iets anders?
        </p>

        <Search />
      </div>

      {posts.totalDocs > 0 ? (
        <div className="container">
          <CollectionArchive posts={posts.docs as CardPostData[]} />
        </div>
      ) : (
        <div className="container">Geen resultaten gevonden</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Search`,
  }
}
