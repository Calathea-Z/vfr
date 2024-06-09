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
        structureTool({
      structure: (S) =>
        S.list()
          .title('Vine & Frond')
          .items([
            S.listItem()
              .title('Shop Items')
              .child(
                S.list()
                  .title('Categories')
                  .items([
                    S.documentTypeListItem('category')
                      .title('Categories')
                      .child(
                        S.documentTypeList('category')
                          .title('Categories')
                          .child((categoryId) =>
                            S.documentList()
                              .title('Sub Categories')
                              .schemaType('subCategory')
                              .filter('_type == "subCategory" && parentCategory._ref == $categoryId')
                              .params({ categoryId })
                              .child((subCategoryId) =>
                                S.documentList()
                                  .title('Products')
                                  .schemaType('product')
                                  .filter('_type == "product" && subCategory._ref == $subCategoryId')
                                  .params({ subCategoryId })
                              )
                          )
                      ),
                  ])
              ),
            S.listItem()
              .title('Settings')
              .child(
                S.list()
                  .title('Settings')
                  .items([
                    S.listItem()
                      .title('Site Config')
                      .child(
                        S.list()
                          .title('Site Config')
                          .items([
                            S.documentTypeListItem('topBanner').title('Top Banner'),
                            S.documentTypeListItem('sideButton').title('Side Button'),
                            S.documentTypeListItem('stockist').title('Stockists List'),
                            S.documentTypeListItem('bio').title('About Page'),
                          ])
                      ),
                    S.listItem()
                      .title('Sanity Settings')
                      .child(
                        S.list()
                          .title('Sanity Settings')
                          .items([
                            S.listItem()
                              .title('Category List')
                              .child(S.documentTypeList('category').title('All Categories')),
                            S.listItem()
                              .title('Sub-Category List')
                              .child(S.documentTypeList('subCategory').title('All Sub-Categories')),
                            S.listItem()
                              .title('All Products')
                              .child(S.documentTypeList('product').title('All Products')),
                          ])
                      ),
                  ])
              ),
          ]),
    }),
    visionTool({defaultApiVersion: apiVersion}),
    colorInput(),
  ],
})
