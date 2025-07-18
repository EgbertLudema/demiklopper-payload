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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Tekstgedeelte met animatie */}
          <motion.div
            className="lg:w-5/12 order-2 lg:order-1"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="relative text-4xl font-bold mb-8 after:content-[''] after:block after:h-[3px] after:w-[70px] after:bg-sky-400 after:mt-2">
              {title}
            </h2>

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

          {/* Afbeelding + Shapes met animatie */}
          <motion.div
            className="lg:w-7/12 order-1 lg:order-2 relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {image?.url && (
              <motion.div
                className="w-full rounded-xl shadow-lg overflow-hidden"
                animate={{
                  x: mousePos.x * 20,
                  y: mousePos.y * 20,
                }}
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

            {/* Bewegende achtergrondelementen */}
            <motion.div
              className="absolute -bottom-10 -left-10 w-48 h-48 bg-sky-600 rounded-xl opacity-20 -z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.2 }}
              animate={{
                x: mousePos.x * 50,
                y: mousePos.y * 50,
              }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
            <motion.div
              className="absolute -top-10 -right-10 w-32 h-32 bg-sky-400 rounded-xl opacity-20 -z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.2 }}
              animate={{
                x: mousePos.x * 50,
                y: mousePos.y * 50,
              }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
