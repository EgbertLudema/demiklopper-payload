'use client'

import Image from 'next/image'
import type { Media } from '@/payload-types'
import RichText from '@/components/RichText'

type Props = {
  text?: any
  imagePosition?: 'left' | 'right'
  media?:
    | {
        url?: string
        alt?: string
        width?: number
        height?: number
      }
    | string
  disableInnerContainer?: boolean
}

export const TextAndImageBlock: React.FC<Props> = ({
  text,
  imagePosition = 'left',
  media,
  disableInnerContainer,
}) => {
  if (!media || typeof media === 'string') return null

  console.log('imagePosition:', imagePosition)

  const image = media

  return (
    <section className="container">
      <div className={disableInnerContainer ? '' : 'container mx-auto px-4'}>
        <div
          className={`flex flex-col-reverse md:flex-row items-center gap-8 ${
            imagePosition === 'right' ? 'md:flex-row-reverse' : ''
          }`}
        >
          <div className="w-full md:w-1/2">
            {image && typeof image === 'object' && image.url && (
              <Image
                src={image.url}
                alt={image.alt || ''}
                width={image.width || 800}
                height={image.height || 600}
                className="rounded-xl shadow-md w-full h-auto object-cover"
              />
            )}
          </div>
          <div className="w-full md:w-1/2">
            <RichText data={text} />
          </div>
        </div>
      </div>
    </section>
  )
}
