'use client'

import { motion } from 'framer-motion'
import RichText from '@/components/RichText'

type Props = {
  introContent: any
}

export const AnimatedIntro = ({ introContent }: Props) => {
  return (
    <motion.div
      className="container mb-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
    </motion.div>
  )
}
