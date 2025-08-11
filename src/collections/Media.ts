import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import * as S3Mod from '@payloadcms/storage-s3'

// Support both export styles across versions
const s3Adapter = (S3Mod as any).s3Adapter ?? (S3Mod as any).default

const isProd = process.env.NODE_ENV === 'production'
const adapter = isProd
  ? s3Adapter({
      bucket: process.env.S3_BUCKET as string,
      config: {
        region: process.env.S3_REGION as string,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
        },
        // Omit for AWS S3; set for R2/MinIO
        ...(process.env.S3_ENDPOINT ? { endpoint: process.env.S3_ENDPOINT } : {}),
      },
    })
  : undefined

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'alt', type: 'text' },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
  upload: {
    // Only set local dir in dev; Vercel prod uses S3 adapter
    ...(isProd ? {} : { staticDir: 'public/media' }),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 300 },
      { name: 'square', width: 500, height: 500 },
      { name: 'small', width: 600 },
      { name: 'medium', width: 900 },
      { name: 'large', width: 1400 },
      { name: 'xlarge', width: 1920 },
      { name: 'og', width: 1200, height: 630, crop: 'center' },
    ],
    ...(adapter ? { adapter } : {}),
  },
}
