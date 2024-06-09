'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\admin\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import { colorInput } from '@sanity/color-input'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schema'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Vine & Frond Sanity Studio',
  basePath: '/admin/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema: {
    types: schemaTypes
  },
  plugins: [
    structureTool(),
    visionTool({defaultApiVersion: apiVersion}),
    colorInput(),
  ],
})
