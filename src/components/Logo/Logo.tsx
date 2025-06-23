import React from 'react'
import clsx from 'clsx'

interface LogoProps {
  isSticky?: boolean
}

export const Logo: React.FC<LogoProps> = ({ isSticky }) => {
  return (
    <p
      className={clsx(
        'text-3xl font-semibold flex items-center gap-2 transition-colors duration-300',
        isSticky ? 'text-black' : 'text-white',
      )}
    >
      DK
    </p>
  )
}
