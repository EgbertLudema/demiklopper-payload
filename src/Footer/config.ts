import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    // Column 1
    {
      type: 'group',
      name: 'column1',
      label: 'Kolom 1',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'text',
          type: 'textarea',
        },
      ],
    },

    // Column 2
    {
      name: 'navItems',
      label: 'Kolom 2 - Menu',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },

    // Column 3
    {
      type: 'group',
      name: 'column3',
      label: 'Kolom 3',
      fields: [
        {
          name: 'titel',
          type: 'text',
        },
        {
          name: 'location',
          type: 'text',
        },
        {
          name: 'text',
          type: 'textarea',
          admin: {
            description: 'Gebruik nieuwe regels om meerdere items op te geven.',
          },
        },
      ],
    },

    // Column 4
    {
      type: 'group',
      name: 'column4',
      label: 'Kolom 4',
      fields: [
        {
          name: 'titel',
          type: 'text',
        },
        {
          name: 'text',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'socials',
      label: 'Social media links',
      type: 'array',
      maxRows: 5,
      fields: [
        {
          name: 'platform',
          label: 'Platform',
          type: 'select',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'TikTok', value: 'tiktok' },
          ],
          required: true,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
