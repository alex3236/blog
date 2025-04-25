import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import { Image, SimpleImage, Gallery } from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import { AlertCard } from '@/components/Card'

export const components: MDXComponents = {
  Image,
  SimpleImage,
  Gallery,
  TOCInline,
  a: CustomLink,
  img: SimpleImage,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  AlertCard,
}
