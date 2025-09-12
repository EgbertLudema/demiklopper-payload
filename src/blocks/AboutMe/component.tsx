'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FiMapPin, FiCamera, FiClock } from 'react-icons/fi'
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
  // Scroll progress normalized to ~[-0.5, 0.5] across the page height
  const [scrollPos, setScrollPos] = useState(0)

  useEffect(() => {
    let raf: number | null = null

    const handleScroll = () => {
      // Use rAF to avoid flooding state updates on fast scrolls
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const maxScroll = Math.max(1, doc.scrollHeight - doc.clientHeight)
        const normalizedY = window.scrollY / maxScroll - 0.6
        setScrollPos(normalizedY)
      })
    }

    // Initialize once on mount so elements are positioned correctly if user lands mid-page
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Tweak these multipliers to tune parallax strength
  const imageY = scrollPos * 100 // main image subtle drift
  const squareLeftX = scrollPos * -30
  const squareLeftY = scrollPos * 80
  const squareRightX = scrollPos * -10
  const squareRightY = scrollPos * 40

  return (
    <section id="about" className="py-16">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Text column */}
          <motion.div
            className="w-full lg:w-5/12 order-2 lg:order-1"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {title && (
              <h2 className="relative text-4xl font-bold mb-8 after:content-[''] after:block after:h-[3px] after:w-[70px] after:bg-sky-400 after:mt-2">
                {title}
              </h2>
            )}

            {text && (
              <div className="text-neutral-700 mb-6 text-left">
                <RichText data={text} enableGutter={false} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-center mb-8">
              {height && (
                <div className="p-3 bg-sky-50 rounded-xl">
                  <span className="block text-3xl font-bold text-sky-600">{height}</span>
                  <span className="text-sm text-neutral-600">Lengte(cm)</span>
                </div>
              )}
              {shoeSize && (
                <div className="p-3 bg-sky-50 rounded-xl">
                  <span className="block text-3xl font-bold text-sky-600">{shoeSize}</span>
                  <span className="text-sm text-neutral-600">Schoenmaat</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details?.location && (
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-sky-600" size={18} />
                  <span>{details.location}</span>
                </div>
              )}
              {details?.camera && (
                <div className="flex items-center gap-2">
                  <FiCamera className="text-sky-600" size={18} />
                  <span>{details.camera}</span>
                </div>
              )}
              {details?.time && (
                <div className="flex items-center gap-2">
                  <FiClock className="text-sky-600" size={18} />
                  <span>{details.time}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Image + parallax shapes (scroll-driven on all devices) */}
          <motion.div
            className="lg:w-7/12 order-1 lg:order-2 relative mb-12 lg:mb-0"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {image?.url && (
              <motion.div
                className="w-full rounded-xl shadow-lg overflow-hidden"
                // All movement now driven by scroll position
                animate={{ y: imageY }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              >
                <Image
                  src={image.url}
                  alt={image.alt || 'Portretfoto'}
                  width={800}
                  height={600}
                  className="w-full object-cover rounded-xl"
                />
              </motion.div>
            )}

            {/* Background floating squares (also scroll-driven) */}
            <motion.div
              className="absolute -bottom-10 -left-10 w-32 h-32 md:w-48 md:h-48 bg-sky-600 rounded-xl opacity-20 -z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.2 }}
              animate={{ x: squareLeftX, y: squareLeftY }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
            <motion.div
              className="absolute -top-10 -right-10 w-24 h-24 md:w-32 md:h-32 bg-sky-400 rounded-xl opacity-20 -z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.2 }}
              animate={{ x: squareRightX, y: squareRightY }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
