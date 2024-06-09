import { sanityImageBuilder } from '@/utils/sanityImageBuilder'
import { dataset, projectId } from '../env'

const imageBuilder = sanityImageBuilder({ projectId, dataset })

export const urlForImage = (source: any) => {
  return imageBuilder?.image(source).auto('format').fit('max').url()
};
