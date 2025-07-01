'use client'

import React, { useEffect, useState } from 'react'
import { CollectionArchive } from '@/components/CollectionArchivePortfolio'
import Link from 'next/link'

interface CollectionArchiveWrapperProps {
  initialItems: any[]
  initialTotalDocs: number
  categoryId?: string
  replaceLoadMoreWithLink?: boolean
  categories: { id: string; title: string; slug: string }[]
  limit: number
}

export const CollectionArchiveWrapper: React.FC<CollectionArchiveWrapperProps> = ({
  initialItems,
  initialTotalDocs,
  categoryId,
  replaceLoadMoreWithLink,
  categories,
  limit,
}) => {
  const [items, setItems] = useState(initialItems)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialItems.length < initialTotalDocs)
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryId ?? null)

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch(
        `/api/portfolio?categoryId=${activeCategory || ''}&page=1&limit=${limit}`,
      )
      const data = await res.json()
      setItems(data.docs)
      setPage(1)
      setHasMore(data.docs.length < data.totalDocs)
    }

    fetchItems()
  }, [activeCategory, limit])

  const loadMore = async () => {
    const nextPage = page + 1
    const res = await fetch(
      `/api/portfolio?categoryId=${activeCategory || ''}&page=${nextPage}&limit=${limit}`,
    )
    const data = await res.json()

    if (data.docs.length > 0) {
      const updatedItems = [...items, ...data.docs]
      setItems(updatedItems)
      setPage(nextPage)

      if (updatedItems.length >= data.totalDocs) {
        setHasMore(false)
      }
    } else {
      setHasMore(false)
    }
  }

  return (
    <>
      <CollectionArchive
        items={items}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <div className="mt-8 text-center">
        {replaceLoadMoreWithLink ? (
          <Link
            href="/portfolio"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded transition"
          >
            Bekijk portfolio
          </Link>
        ) : (
          hasMore && (
            <button
              onClick={loadMore}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded transition"
            >
              Laad meer
            </button>
          )
        )}
      </div>
    </>
  )
}
