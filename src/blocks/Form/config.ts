import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'formTitle',
      type: 'text',
      label: 'Formulier Titel',
      admin: {
        placeholder: 'Bijv. Neem contact op',
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: 'Intro Content',
    },
    {
      name: 'enableInfo',
      type: 'checkbox',
      label: 'Enable Info Block',
    },
    {
      name: 'infoBlock',
      type: 'group',
      label: 'Info Block',
      admin: {
        condition: (_, { enableInfo }) => Boolean(enableInfo),
      },
      fields: [
        {
          name: 'content',
          type: 'richText',
          label: 'Info Block Content',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
        {
          name: 'location',
          type: 'text',
          label: 'Locatie',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram Link',
          admin: {
            placeholder: 'https://instagram.com/...',
          },
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}
