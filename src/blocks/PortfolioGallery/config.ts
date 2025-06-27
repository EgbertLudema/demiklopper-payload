import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const PortfolioGallery: Block = {
  slug: 'portfolioGallery',
  interfaceName: 'PortfolioGalleryBlock',
  labels: {
    singular: 'Portfolio Gallery',
    plural: 'Portfolio Galleries',
  },
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: 'Intro Content',
    },
    {
      name: 'limit',
      label: 'Aantal items om te tonen',
      type: 'number',
      defaultValue: 12,
      admin: {
        step: 3,
      },
    },
    {
      name: 'replaceLoadMoreWithLink',
      type: 'checkbox',
      label: 'Vervang "Laad meer" knop met link naar portfolio pagina',
    },
  ],
}
