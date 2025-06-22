'use client'

import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const PortfolioCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts' | 'portfolio'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn('group relative w-full h-full overflow-hidden rounded-lg', className)}
      ref={card.ref}
    >
      <Link href={href} ref={link.ref} className="block w-full h-full">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          {metaImage && typeof metaImage !== 'string' ? (
            <Media resource={metaImage} size="33vw" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm">
              No image
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 z-10 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white p-4 flex flex-col justify-end">
          {hasCategories && (
            <div className="uppercase text-xs mb-2 tracking-wide">
              {categories.map((category, index) =>
                typeof category === 'object' ? (
                  <Fragment key={index}>
                    {category.title || 'Categorie'}
                    {index < categories.length - 1 && ', '}
                  </Fragment>
                ) : null,
              )}
            </div>
          )}
          {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
          {description && <p className="text-sm line-clamp-3 opacity-90">{sanitizedDescription}</p>}
        </div>
      </Link>
    </article>
  )
}
