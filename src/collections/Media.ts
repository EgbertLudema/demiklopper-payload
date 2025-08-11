import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const isProd = process.env.NODE_ENV === 'production'

async function getS3Adapter() {
  // Only load in production
  if (!isProd) return undefined

  // Dynamically import so Next won’t statically analyze exports at build time
  const mod: any = await import('@payloadcms/storage-s3')

  // Try common shapes across versions
  const factory =
    mod?.s3Adapter || // named export (some versions)
    mod?.default || // default export (other versions)
    mod?.S3Adapter || // class constructor (fallback)
    mod?.adapter || // generic name (rare)
    null

  const cfg = {
    bucket: process.env.S3_BUCKET as string,
    config: {
      region: process.env.S3_REGION as string,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
      },
      ...(process.env.S3_ENDPOINT ? { endpoint: process.env.S3_ENDPOINT } : {}),
    },
  }

  if (typeof factory === 'function') {
    // function-style factory
    return factory(cfg)
  }
  if (factory && typeof factory === 'object' && typeof factory.constructor === 'function') {
    // class-style export
    return new factory(cfg)
  }

  throw new Error(
    'Could not resolve an adapter factory from @payloadcms/storage-s3. Check package version.',
  )
}

const adapter = await getS3Adapter()

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
    // Local FS in dev only; Vercel prod uses S3 adapter
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
