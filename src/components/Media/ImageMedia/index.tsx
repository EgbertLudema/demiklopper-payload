'use client'

import type { StaticImageData } from 'next/image'
import { cn } from '@/utilities/ui'
import NextImage from 'next/image'
import React from 'react'

import type { Props as MediaProps } from '../types'
import { cssVariables } from '@/cssVariables'
import { getMediaUrl } from '@/utilities/getMediaUrl'

const { breakpoints } = cssVariables

const placeholderBlur =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAA...'

// 👉 Convert absolute same-origin URLs to relative, so Next/Image treats them as internal
function normalizeSrc(src: string): string {
  if (!src || src.startsWith('/')) return src
  try {
    const u = new URL(src, typeof window !== 'undefined' ? window.location.origin : undefined)
    const sameOrigin =
      (typeof window !== 'undefined' && u.origin === window.location.origin) ||
      u.hostname === 'www.demi-k.nl' ||
      u.hostname === 'demi-k.nl'
    return sameOrigin ? u.pathname + u.search : src
  } catch {
    return src
  }
}

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
  } = props

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const { alt: altFromResource, height: fullHeight, url, width: fullWidth, updatedAt } = resource
    width = fullWidth ?? undefined
    height = fullHeight ?? undefined
    alt = altFromResource || ''

    const cacheTag = updatedAt
    src = getMediaUrl(url, cacheTag) // may return absolute -> normalize below
  }

  // 🔑 Normalize here
  if (typeof src === 'string') {
    src = normalizeSrc(src)
  }

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined)

  // Keep it simple & correct; lets Next generate proper srcset widths
  const sizes = sizeFromProps ?? '100vw'

  return (
    <picture className={cn(pictureClassName)}>
      <NextImage
        alt={alt || ''}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height : undefined}
        placeholder="blur"
        blurDataURL={placeholderBlur}
        priority={priority}
        quality={100}
        loading={loading}
        sizes={sizes}
        src={src}
        width={!fill ? width : undefined}
      />
    </picture>
  )
}
