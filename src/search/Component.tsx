'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'
import { SearchIcon } from 'lucide-react'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    router.push(`/zoeken${debouncedValue ? `?q=${debouncedValue}` : ''}`)
  }, [debouncedValue, router])

  return (
    <div>
      <form
        className="flex items-center justify-center gap-2 max-w-[50rem] mx-auto"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Zoek
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder="Zoek op naam, categorie of tag..."
        />
        <button
          type="submit"
          className="flex justify-center items-center gap-2 bg-primary py-2 px-6 text-white rounded-lg"
        >
          <SearchIcon className="w-5 h-5" />
          Zoeken
        </button>
      </form>
    </div>
  )
}
