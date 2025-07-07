'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { Portfolio } from '@/payload-types'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

export const PortfolioHero: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => {
  const router = useRouter()
  console.log('portfolio.categories', portfolio.categories)

  return (
    <div className="relative px-4 py-6 md:px-8 bg-sky-500/5">
      <div className="container mt-20 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-sky-600 hover:text-sky-800 transition"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug naar vorige pagina
        </button>

        <h1 className="mt-6 text-4xl font-bold text-sky-900">{portfolio.title}</h1>

        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-sky-700">
          {portfolio.categories?.map((cat: any) => (
            <span key={cat.id} className="bg-sky-100 px-2 py-1 rounded">
              {cat.label || cat.title || cat.name}
            </span>
          ))}

          {portfolio.publishedOn && (
            <span className="text-sky-800 ml-2 text-md">
              {format(new Date(portfolio.publishedOn), 'MMMM yyyy', { locale: nl })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
