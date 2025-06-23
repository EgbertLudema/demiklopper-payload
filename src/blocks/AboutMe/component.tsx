'use client'

import Image from 'next/image'
import type { Media } from '@/payload-types'
import RichText from '@/components/RichText'

type Props = {
  title: string
  text?: any
  height?: string
  shoeSize?: string
  details?: {
    location?: string
    camera?: string
    time?: string
  }
  image?: Media
}

export const AboutMeBlock: React.FC<Props> = ({
  title,
  text,
  height,
  shoeSize,
  details,
  image,
}) => {
  return (
    <section className="about-me py-20 container">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>

      {text && <RichText data={text} />}

      <ul className="mb-6 space-y-1">
        {height && (
          <li>
            <strong>Lengte:</strong> {height}
          </li>
        )}
        {shoeSize && (
          <li>
            <strong>Schoenmaat:</strong> {shoeSize}
          </li>
        )}
        {details && (
          <>
            {details.location && (
              <li>
                <strong>Locatie:</strong> {details.location}
              </li>
            )}
            {details.camera && (
              <li>
                <strong>Camera:</strong> {details.camera}
              </li>
            )}
            {details.time && (
              <li>
                <strong>Tijd:</strong> {details.time}
              </li>
            )}
          </>
        )}
      </ul>

      {image?.url && (
        <Image
          src={image.url}
          alt={image.alt || ''}
          width={800}
          height={600}
          className="rounded shadow-lg"
        />
      )}
    </section>
  )
}
