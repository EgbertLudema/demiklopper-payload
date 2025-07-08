'use client'

import { motion } from 'framer-motion'
import { PortfolioCard } from '../CardPortfolio'

type Props = {
  items: {
    id: string
    slug: string
    title: string
    meta: {
      image?: any
    }
    publishedOn?: string
    categories?: any[]
  }[]
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
}

export const RelatedPortfolioSlider: React.FC<Props> = ({ items }) => {
  if (!items.length) return null

  return (
    <section className="container mx-auto px-4 pb-12">
      <h2 className="text-2xl font-bold mb-6">Gerelateerde items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <PortfolioCard className="h-[280px]" doc={item} relationTo="portfolio" showCategories />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
