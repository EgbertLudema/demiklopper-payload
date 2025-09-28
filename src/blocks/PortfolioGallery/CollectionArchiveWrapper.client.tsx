'use client'

import React, { useEffect, useState } from 'react'
import { CollectionArchive } from '@/components/CollectionArchivePortfolio'
import Link from 'next/link'

interface CollectionArchiveWrapperProps {
  initialTotalDocs: number
  categoryId?: string
  replaceLoadMoreWithLink?: boolean
  categories: { id: string; title: string; slug: string }[]
  limit: number
}

// Simple skeleton cards for the grid
const SkeletonGrid: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="container">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl overflow-hidden">
            <div className="aspect-[4/3] bg-slate-200 rounded-xl overflow-hidden" />
          </div>
        ))}
      </div>
    </div>
  )
}

export const CollectionArchiveWrapper: React.FC<CollectionArchiveWrapperProps> = ({
  categoryId,
  replaceLoadMoreWithLink,
  categories,
  limit,
}) => {
  // Always start empty/loading so we see the skeleton first
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryId ?? null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPage = async (pageToGet: number, append = false) => {
    const res = await fetch(
      `/api/portfolio?categoryId=${activeCategory || ''}&page=${pageToGet}&limit=${limit}`,
      { cache: 'no-store' },
    )
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`)
    }
    const data = await res.json()
    return data as { docs: any[]; totalDocs: number }
  }

  // Initial & category-change fetch
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setIsLoading(true)
      setError(null)
      setItems([])
      setPage(1)
      try {
        const data = await fetchPage(1)
        if (cancelled) return
        setItems(data.docs)
        setHasMore(data.docs.length < data.totalDocs)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Er ging iets mis bij het laden.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
    // re-fetch when category or limit changes
  }, [activeCategory, limit])

  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return
    setIsLoadingMore(true)
    setError(null)
    const nextPage = page + 1
    try {
      const data = await fetchPage(nextPage, true)
      const updatedItems = [...items, ...data.docs]
      setItems(updatedItems)
      setPage(nextPage)
      if (updatedItems.length >= data.totalDocs) {
        setHasMore(false)
      }
    } catch (e: any) {
      setError(e?.message || 'Kon niet meer items laden.')
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <>
      {/* While items are loading, show skeleton grid; otherwise show the real archive */}
      {isLoading ? (
        <>
          {/* Optional: show just the category controls from your archive if you split them out.
              If not, skeleton-only is fine here. */}
          <SkeletonGrid count={limit} />
        </>
      ) : (
        <CollectionArchive
          items={items}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      )}

      {/* Error (non-fatal) */}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {/* Footer actions */}
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
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded transition"
            >
              {isLoadingMore ? (
                <>
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-b-transparent animate-spin" />
                  Laden…
                </>
              ) : (
                'Laad meer'
              )}
            </button>
          )
        )}
      </div>
    </>
  )
}
