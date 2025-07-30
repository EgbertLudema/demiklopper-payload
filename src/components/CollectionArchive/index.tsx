import React from 'react'
import { PortfolioCard } from '../CardPortfolio'
import type { CardPostData } from '@/components/CardPortfolio'

export const CollectionArchive = ({ posts }: { posts: CardPostData[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((item) => (
        <PortfolioCard
          key={item.slug}
          doc={item}
          relationTo="portfolio"
          className="h-[280px]"
          showCategories
        />
      ))}
    </div>
  )
}
