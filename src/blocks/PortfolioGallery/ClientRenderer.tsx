'use client'

import React from 'react'
import { CollectionArchiveWrapper } from './CollectionArchiveWrapper.client'

interface ClientRendererProps {
  initialItems: any[]
  initialTotalDocs: number
  categoryId?: string
  replaceLoadMoreWithLink?: boolean
  categories: { id: string; title: string; slug: string }[]
  limit: number
}

export const ClientRenderer: React.FC<ClientRendererProps> = ({
  initialItems,
  initialTotalDocs,
  categoryId,
  replaceLoadMoreWithLink,
  categories,
  limit,
}) => {
  return (
    <CollectionArchiveWrapper
      initialItems={initialItems}
      initialTotalDocs={initialTotalDocs}
      categoryId={categoryId}
      replaceLoadMoreWithLink={replaceLoadMoreWithLink}
      categories={categories}
      limit={limit}
    />
  )
}
