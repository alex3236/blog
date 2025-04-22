import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { allBlogs } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

const POSTS_PER_PAGE = 10

export async function generateMetadata(props: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const params = await props.params
  const category = decodeURI(params.category)
  return genPageMetadata({
    title: category,
    description: `${siteMetadata.title} ${category} classified content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/categories/${category}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const categoryCounts = categoryData as Record<string, number>
  const categoryKeys = Object.keys(categoryCounts)
  return categoryKeys.map((category) => ({
    category: encodeURI(category),
  }))
}

export default async function CategoryPage(props: {
  params: Promise<{ category: string; page: string }>
  searchParams: Promise<{ page: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const category = decodeURI(params.category)
  const title = category[0].toUpperCase() + category.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.category && slug(post.category) == category))
  )
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const pageNumber = parseInt(searchParams.page) || 1
  const initialDisplayPosts = filteredPosts.slice(
    (pageNumber - 1) * POSTS_PER_PAGE,
    pageNumber * POSTS_PER_PAGE
  )
  console.log(pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={initialDisplayPosts}
      pagination={pagination}
      title={title}
      searchBar={false}
    />
  )
}
