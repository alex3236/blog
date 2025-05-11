'use client'

import Link from 'next/link'
import { FaRss } from 'react-icons/fa6'
import { usePathname } from 'next/navigation'
import { rssAvailableSubpaths } from '../app/sitemap'

export default function RSSButton() {
  const pathname = usePathname()
  const isRootPath = pathname === '/'
  const subpath = pathname.split('/')[1] ?? ''
  const isRssAvailable = rssAvailableSubpaths.includes(subpath)
  return (
    isRssAvailable && (
      <Link
        href={isRootPath ? '/feed.xml' : `${pathname}/feed.xml`}
        className="flex items-center justify-center rounded-md border-2 border-gray-400 p-1 text-gray-600 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-400"
      >
        <FaRss className="h-5 w-5" />
      </Link>
    )
  )
}
