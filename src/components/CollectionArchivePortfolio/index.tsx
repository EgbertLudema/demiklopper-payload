'use client'

import { useState } from 'react'
import { cn } from '@/utilities/ui'
import { PortfolioCard } from '../CardPortfolio'
import { AnimatePresence, motion } from 'framer-motion'

type Category = {
  id: string
  title: string
  slug: string
}

type Props = {
  items: any[]
  categories: Category[]
}

export const CollectionArchive: React.FC<Props> = ({ items, categories }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredItems = activeCategory
    ? items.filter((item) => item.categories?.some((cat) => cat.slug === activeCategory))
    : items

  return (
    <div className={cn('container')}>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn('border px-3 py-1 rounded', !activeCategory && 'bg-primary text-white')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={cn(
              'border px-3 py-1 rounded',
              activeCategory === cat.slug && 'bg-primary text-white',
            )}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <PortfolioCard
                  className="h-[280px]"
                  doc={item}
                  relationTo="portfolio"
                  showCategories
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center text-gray-500 py-8"
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Geen portfolio items gevonden voor deze categorie.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
