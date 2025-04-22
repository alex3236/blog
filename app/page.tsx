import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayout'
import NavSection from '@/components/NavSection'
import siteMetadata from '@/data/siteMetadata'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: siteMetadata.title })

export default async function BlogPage(props: { searchParams: Promise<{ page: string }> }) {
  const posts = allCoreContent(sortPosts(allBlogs)).filter((post) => !post.draft)
  const params = await props.searchParams
  let pageNumber = parseInt(params.page) || 1
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

  return (
    <>
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="纪事"
      />
      <NavSection />
    </>
  )
}
