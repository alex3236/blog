'use client'

import { useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { formatDate, formatTime } from '@/data/navLinks'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6'
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
        'mb-4 flex items-center justify-end pr-4 xl:mb-0' + (alignRight ? ' col-start-5' : '')
      }
    >
      {prevPage ? (
        <Link
          href={pathname + '?' + createQueryString('page', String(currentPage - 1))}
          className="p-2"
        >
          <FaCaretLeft className="h-5 w-5" />
        </Link>
      ) : (
        <button disabled={true} className="p-2 opacity-50">
          <FaCaretLeft className="h-5 w-5" />
        </button>
      )}
      <span className="mx-2">
        {currentPage} / {totalPages}
      </span>
      {nextPage ? (
        <Link
          href={pathname + '?' + createQueryString('page', String(currentPage + 1))}
          className="p-2"
        >
          <FaCaretRight className="h-5 w-5" />
        </Link>
      ) : (
        <button disabled={true} className="p-2 opacity-50">
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
                <li key={path} className="py-4 xl:py-2">
                  <article className="xl:grid xl:grid-cols-5 xl:items-baseline xl:space-y-0">
                    <dl className="xl:pr-6 xl:text-right xl:align-text-top xl:text-lg">
                      <dt className="sr-only">Published on</dt>
                      <dd className="leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>
                          {formatDate(date, 'en-US')}
                          <span className="hidden xl:block">{formatTime(date)}</span>
                        </time>
                      </dd>
                    </dl>
                    <div className="xl:col-span-4">
                      <div>
                        <h3 className="text-2xl leading-8 font-bold tracking-tight">
                          <Link
                            href={`/${path}`}
                            className="text-primary-600 dark:text-primary-500 font-serif"
                          >
                            {title}
                          </Link>
                        </h3>
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
          <div className="mt-4 xl:grid xl:grid-cols-5">
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                alignRight={!searchBar}
              />
            )}
            {searchBar && (
              <SearchButtonWrapper className="relative w-full xl:col-span-4 xl:col-start-2">
                <span className="block w-full rounded-xl border-2 border-gray-400 px-4 py-2 text-left text-gray-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-400">
                  Search articles
                </span>
                <svg
                  className="absolute top-3 right-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </SearchButtonWrapper>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
