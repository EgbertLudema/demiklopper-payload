'use client'

import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { FiDownload, FiZoomIn } from 'react-icons/fi'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'publishedOn'>

export const PortfolioCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts' | 'portfolio'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo } = props

  const { slug, meta, title, publishedOn } = doc || {}
  const { image: metaImage } = meta || {}

  const href = `/${relationTo}/${slug}`
  const downloadUrl =
    metaImage && typeof metaImage === 'object' && 'url' in metaImage ? metaImage.url : null

  const formattedDate = publishedOn
    ? new Date(publishedOn).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <article
      className={cn('group relative w-full h-full overflow-hidden rounded-xl', className)}
      ref={card.ref}
    >
      {/* Klikbare achtergrondafbeelding */}
      <Link href={href} ref={link.ref} className="block w-full h-full">
        <div className="absolute inset-0 z-0">
          {metaImage && typeof metaImage !== 'string' ? (
            <Media
              resource={metaImage}
              size="33vw"
              className="portfolio-card-image w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Overlay met titel, datum en knoppen */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white flex flex-col justify-end p-4">
        {/* Titel */}
        {title && <h3 className="text-lg font-bold">{title}</h3>}

        {/* Datum */}
        {formattedDate && (
          <p className="text-sm font-semibold text-sky-400 mt-1">{formattedDate}</p>
        )}

        {/* Knoppen */}
        <div className="flex gap-2 mt-4">
          <Link
            href={href}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-row justify-center items-center gap-1 bg-white text-black text-sm px-3 py-1 rounded hover:bg-gray-200 transition"
          >
            <FiZoomIn className="inline mr-1" />
            Bekijken
          </Link>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              onClick={(e) => e.stopPropagation()}
              className="flex flex-row justify-center items-center gap-1 bg-white text-black text-sm px-3 py-1 rounded hover:bg-gray-200 transition"
            >
              <FiDownload />
              Download
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
