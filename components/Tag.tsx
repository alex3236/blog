import Link from 'next/link'
import { slug } from 'github-slugger'

interface Props {
  text: string
  className?: string
}

const Category = ({ text, className }: Props) => {
  return (
    <Link
      href={`/categories/${slug(text)}`}
      className={
        className ??
        'mr-3 rounded-full border-2 border-sky-500 px-2 text-sm font-medium text-sky-700 uppercase hover:text-sky-500 dark:text-sky-500 dark:hover:text-sky-400'
      }
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

const Tag = ({ text, className }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className={
        className ??
        'text-primary-700 border-primary-500 hover:text-primary-500 dark:hover:text-primary-400 dark:text-primary-500 mr-3 rounded-full border-2 px-2 text-sm font-medium uppercase'
      }
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export { Tag, Category }
