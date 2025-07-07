'use client'

import { Download } from 'lucide-react'

interface Props {
  imageUrl: string
  title: string
}

export const DownloadButton: React.FC<Props> = ({ imageUrl, title }) => {
  return (
    <a
      href={imageUrl}
      download={title ? `${title}.jpg` : 'demi_klopper.jpg'}
      className="bg-primary hover:bg-primary/80 rounded-xl text-white px-4 py-2 text-md flex items-center gap-2 whitespace-nowrap transition"
    >
      <Download className="h-4 w-4" />
      Download Afbeelding
    </a>
  )
}
