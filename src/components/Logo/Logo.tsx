import React from 'react'
import clsx from 'clsx'

interface LogoProps {
  isWhite?: boolean
}

export const Logo: React.FC<LogoProps> = ({ isWhite }) => {
  return (
    <p
      className={clsx(
        'text-3xl font-semibold flex items-center gap-2 transition-colors duration-300',
        isWhite ? 'text-white' : 'text-black',
      )}
    >
      DK
    </p>
  )
}
