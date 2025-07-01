'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [isSticky, setIsSticky] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSticky ? 'bg-white/80 backdrop-blur-md py-4 shadow-md' : 'bg-transparent py-8'
      }`}
    >
      <div className="container flex justify-between items-center transition-all duration-300">
        <Link href="/" className="transition-opacity duration-300">
          <Logo isSticky={isSticky} />
        </Link>
        <HeaderNav data={data} isSticky={isSticky} />
      </div>
    </header>
  )
}
