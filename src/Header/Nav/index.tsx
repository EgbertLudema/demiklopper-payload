'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

export const HeaderNav: React.FC<{ data: HeaderType; isWhite?: boolean }> = ({ data, isWhite }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance={isWhite ? 'linkWhite' : 'linkBlack'} />
      })}
      <Link href="/search">
        <span className="sr-only">Zoek</span>
        <SearchIcon
          className={cn('w-5 transition-colors', isWhite ? 'text-white' : 'text-black')}
        />
      </Link>
    </nav>
  )
}
