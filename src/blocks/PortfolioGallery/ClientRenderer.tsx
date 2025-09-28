'use client'

import React from 'react'
import { CollectionArchiveWrapper } from './CollectionArchiveWrapper.client'

interface ClientRendererProps {
  initialTotalDocs?: number
  categoryId?: string
  replaceLoadMoreWithLink?: boolean
  categories: { id: string; title: string; slug: string }[]
  limit: number
}

export const ClientRenderer: React.FC<ClientRendererProps> = ({
  initialTotalDocs = 0,
  categoryId,
  replaceLoadMoreWithLink,
  categories,
  limit,
}) => {
  return (
    <CollectionArchiveWrapper
      initialTotalDocs={initialTotalDocs}
      categoryId={categoryId}
      replaceLoadMoreWithLink={replaceLoadMoreWithLink}
      categories={categories}
      limit={limit}
    />
  )
}
