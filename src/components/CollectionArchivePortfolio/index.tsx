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

const itemVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

export const CollectionArchive: React.FC<Props> = ({ items, categories }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredItems = activeCategory
    ? items.filter((item) => item.categories?.some((cat) => cat.slug === activeCategory))
    : items

  return (
    <div className={cn('container')}>
      {/* Filter Buttons met animatie */}
      <motion.div className="flex flex-wrap gap-2 mb-8" initial="hidden" animate="visible">
        <motion.button
          variants={itemVariant}
          custom={0}
          onClick={() => setActiveCategory(null)}
          className={cn('border px-3 py-1 rounded-lg', !activeCategory && 'bg-primary text-white')}
        >
          Alles
        </motion.button>
        {categories.map((cat, index) => (
          <motion.button
            key={cat.id}
            variants={itemVariant}
            custom={index + 1}
            onClick={() => setActiveCategory(cat.slug)}
            className={cn(
              'border px-3 py-1 rounded-lg',
              activeCategory === cat.slug && 'bg-primary text-white',
            )}
          >
            {cat.title}
          </motion.button>
        ))}
      </motion.div>

      {/* Grid met animatie per item */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                variants={itemVariant}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.2 }}
                custom={index}
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
