'use client'

import { useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { formatDate, formatTime } from '@/data/navLinks'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { FaCaretLeft, FaCaretRight, FaMagnifyingGlass } from 'react-icons/fa6'
import { AlgoliaButton } from 'pliny/search/AlgoliaButton'
import { KBarButton } from 'pliny/search/KBarButton'

interface PaginationProps {
  totalPages: number
  currentPage: number
  alignRight?: boolean
}

interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  pagination?: PaginationProps
  // initialDisplayPosts?: CoreContent<Blog>[]
  searchBar?: boolean
}

function Pagination({ totalPages, currentPage, alignRight }: PaginationProps) {
  const pathname = usePathname()
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages
  const searchParams = useSearchParams()
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <nav
      className={
        'mb-4 flex items-center justify-end pr-4 md:mb-0' + (alignRight ? ' col-start-5' : '')
      }
    >
      {prevPage ? (
        <Link
          aria-label="Previous Page"
          href={pathname + '?' + createQueryString('page', String(currentPage - 1))}
          className="p-2"
        >
          <FaCaretLeft className="h-5 w-5" />
        </Link>
      ) : (
        <button aria-label="No previous page available" disabled={true} className="p-2 opacity-50">
          <FaCaretLeft className="h-5 w-5" />
        </button>
      )}
      <span className="mx-2">
        {currentPage} / {totalPages}
      </span>
      {nextPage ? (
        <Link
          aria-label="Next Page"
          href={pathname + '?' + createQueryString('page', String(currentPage + 1))}
          className="p-2"
        >
          <FaCaretRight className="h-5 w-5" />
        </Link>
      ) : (
        <button aria-label="No more page available" disabled={true} className="p-2 opacity-50">
          <FaCaretRight className="h-5 w-5" />
        </button>
      )}
    </nav>
  )
}

export default function ListLayout({
  title,
  posts = [],
  pagination,
  searchBar = true,
}: ListLayoutProps) {
  let SearchButtonWrapper
  if (
    siteMetadata.search &&
    (siteMetadata.search.provider === 'algolia' || siteMetadata.search.provider === 'kbar')
  ) {
    SearchButtonWrapper = siteMetadata.search.provider === 'algolia' ? AlgoliaButton : KBarButton
  }

  return (
    <>
      <div>
        <div className="pt-6 pb-5">
          <h1 className="text-4xl leading-10 font-extrabold tracking-tight text-gray-700 sm:leading-14 dark:text-gray-200">
            {title}
          </h1>

          <ul>
            {posts?.map((post) => {
              const { path, date, title, summary } = post
              return (
                <li key={path} className="py-4 md:py-2">
                  <article className="md:grid md:grid-cols-5 md:items-baseline md:space-y-0">
                    <dl className="md:pr-6 md:text-right md:align-text-top md:text-lg">
                      <dt className="sr-only">Published on</dt>
                      <dd className="leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>
                          {formatDate(date, 'en-US')}
                          <span className="hidden md:block">{formatTime(date)}</span>
                        </time>
                      </dd>
                    </dl>
                    <div className="md:col-span-4">
                      <div>
                        <h2 className="text-2xl leading-8 font-bold tracking-tight">
                          <Link
                            href={`/${path}`}
                            className="text-primary-600 dark:text-primary-500 font-serif"
                          >
                            {title}
                          </Link>
                        </h2>
                        {/*<div className="flex flex-wrap">*/}
                        {/*  {tags?.map((tag) => <Tag key={tag} text={tag} />)}*/}
                        {/*</div>*/}
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-300">
                        {summary}
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 md:grid md:grid-cols-5">
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                alignRight={!searchBar}
              />
            )}
            {searchBar && (
              <SearchButtonWrapper className="relative w-full cursor-pointer rounded-xl border-2 border-gray-500 px-4 py-2 transition-all hover:shadow-xl md:col-span-4 md:col-start-2 dark:hover:bg-gray-800">
                <span className="block w-full text-left text-gray-500">搜搜搜…</span>
                <FaMagnifyingGlass className="absolute top-3 right-3 h-4 w-4 fill-gray-500 dark:text-gray-300" />
              </SearchButtonWrapper>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
