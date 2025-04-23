import { ReactNode } from 'react'
import { formatDate } from '@/data/navLinks'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { Category, Tag } from '@/components/Tag'
import IconSeal from '@/components/IconSeal'
import { PhotoProvider } from '@/components/PhotoPreviewerWrapper'

interface LayoutProps {
  blog: Blog
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  modified?: string
}

export default function PostLayout({ blog, next, prev, children }: LayoutProps) {
  const { slug, date, title } = blog

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <header>
            <div className="space-y-1 border-b border-gray-200 pb-5 dark:border-gray-700">
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              <div className="py-0.5 md:float-right md:justify-end">
                <Category text={blog.category ?? 'NIL'} />
                {blog.tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
              <dl>
                <div>
                  <dt className="sr-only">Last modified on</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    <time dateTime={blog.lastmod || date}>
                      {formatDate(blog.lastmod || date, siteMetadata.locale)}
                    </time>
                    {blog.weather && <span>, {blog.weather}</span>}
                  </dd>
                </div>
              </dl>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-4 xl:divide-y-0 dark:divide-gray-700">
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">
                <PhotoProvider>{children}</PhotoProvider>
                {!blog.draft && siteMetadata.showSeal && (
                  <div className="flex justify-end">
                    <IconSeal aria-label="印章：又活一日" className="h-14 w-14" />
                  </div>
                )}
              </div>
            </div>
            {siteMetadata.comments && (
              <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300" id="comment">
                <Comments slug={slug} />
              </div>
            )}
            <footer>
              <div className="text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {!blog.draft && prev && prev.path && (
                  <div className="flex justify-start pt-2">
                    <Link
                      href={`/${prev.path}`}
                      className="text-primary-600 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Previous post: ${prev.title}`}
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {!blog.draft && next && next.path && (
                  <div className="flex justify-end pt-2">
                    <Link
                      href={`/${next.path}`}
                      className="text-primary-600 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Next post: ${next.title}`}
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
