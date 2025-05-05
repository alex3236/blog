import NextImage, { ImageProps } from 'next/image'
import { PhotoView } from '@/components/PhotoPreviewerWrapper'
import { ImgProps } from 'next/dist/shared/lib/get-img-props'
import React from 'react'

const basePath = process.env.BASE_PATH

/**
 * Image component that wraps Next.js Image component
 * Default width 600px as the max width should under 600px (~575px)
 * */

const Image = ({ src, width, height, ...rest }: ImageProps) => (
  <NextImage src={`${basePath || ''}${src}`} height={height ?? 0} width={width ?? 600} {...rest} />
)

const SimpleImage = ({ src, className, width, height, alt, ...rest }: ImgProps) => (
  <picture className="flex flex-col items-center space-y-2">
    <PhotoView src={src}>
      <NextImage
        src={src}
        alt={alt && alt.startsWith('#') ? alt.substring(1) : alt}
        width={600}
        height={0}
        className={`h-auto max-h-[1000px] w-auto max-w-72 min-w-0 rounded-lg border-2 border-gray-600 sm:max-w-96 xl:max-w-xl dark:border-gray-300 ${className}`}
        {...rest}
      />
    </PhotoView>
    {alt && alt.startsWith('#') && (
      <span className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
        {alt.substring(1)}
      </span>
    )}
  </picture>
)

const Gallery = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-4 p-4">{children}</div>
)

export { Image, SimpleImage, Gallery }
