import NextImage, { ImageProps } from 'next/image'
import { PhotoView } from '@/components/PhotoPreviewerWrapper'
import { ImgProps } from 'next/dist/shared/lib/get-img-props'

const basePath = process.env.BASE_PATH

/**
 * Image component that wraps Next.js Image component
 * Default width 600px as the max width should under 600px (~575px)
 * */

const Image = ({ src, width, height, ...rest }: ImageProps) => (
  <NextImage src={`${basePath || ''}${src}`} height={height ?? 0} width={width ?? 600} {...rest} />
)

const SimpleImage = ({ src, width, height, ...rest }: ImgProps) => (
  <picture className="flex justify-center">
    <PhotoView src={src}>
      <NextImage
        src={src}
        width={600}
        height={0}
        className="h-auto max-h-[1000px] w-auto max-w-72 min-w-0 rounded-lg border-2 border-gray-600 sm:max-w-96 xl:max-w-xl dark:border-gray-300"
        {...rest}
      />
    </PhotoView>
  </picture>
)

export { Image, SimpleImage }
