import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayoutWithYears from '@/layouts/ListLayoutWithYears'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { getValidDate } from '@/data/navLinks'

const POSTS_PER_PAGE = 10

export const metadata: Metadata = genPageMetadata({
  title: 'Archive',
  description: 'All posts archive',
})

export default async function ArchivePage(props: {
  params: Promise<{ year: string }>
  searchParams: Promise<{ page: string }>
}) {
  const params = await props.params
  const posts = allCoreContent(sortPosts(allBlogs))
    .filter((post) => !post.draft)
    .filter((post) => getValidDate(post.date)?.getFullYear().toString() === params.year)
  const searchParams = await props.searchParams
  let pageNumber = parseInt(searchParams.page) || 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  pageNumber = Math.min(Math.max(pageNumber, 1), totalPages) // prevent page out of range
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return <ListLayoutWithYears posts={initialDisplayPosts} pagination={pagination} title="Archive" />
}
