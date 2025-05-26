import { allBlogs } from 'contentlayer/generated'
import { sortPosts } from 'pliny/utils/contentlayer'
import { notFound, redirect } from 'next/navigation'

export default async function ArchivesPage() {
  const sortedBlogs = sortPosts(allBlogs).filter((post) => !post.draft)

  if (sortedBlogs.length === 0) {
    return notFound()
  }

  const latestBlog = sortedBlogs[0]
  const latestYear = new Date(latestBlog.date).getFullYear().toString()

  return redirect(`/archives/${latestYear}`)
}
