import type { Block } from 'payload'

export const AboutMe: Block = {
  slug: 'aboutMe',
  interfaceName: 'AboutMeBlock',
  labels: {
    singular: 'About Me',
    plural: 'About Me Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'text',
      type: 'richText',
    },
    {
      name: 'height',
      label: 'Lengte',
      type: 'text',
    },
    {
      name: 'shoeSize',
      label: 'Schoenmaat',
      type: 'text',
    },
    {
      name: 'details',
      type: 'group',
      fields: [
        {
          name: 'location',
          type: 'text',
        },
        {
          name: 'camera',
          type: 'text',
        },
        {
          name: 'time',
          type: 'text',
          label: 'Tijd',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
