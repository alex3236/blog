import 'css/prism.css'
import 'katex/dist/katex.css'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import { allBlogs } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { getValidDate } from '@/data/navLinks'

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug)
  // const authorList = post?.authors || ['default']
  // const authorDetails = authorList.map((author) => {
  //   const authorResults = allAuthors.find((p) => p.slug === author)
  //   return coreContent(authorResults as Authors)
  // })
  if (!post) {
    return
  }
  const publishedAt = new Date(getValidDate(post.date) ? post.date : 0).toISOString()
  const modifiedAt = post.lastmod ? new Date(post.lastmod).toISOString() : publishedAt
  // const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img?.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'zh_CN',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      // authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  return allBlogs.map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const sortedBlogs = sortPosts(allBlogs)

  if (sortedBlogs.findIndex((p) => p.slug === slug) === -1) {
    return notFound()
  }

  const filteredBlogs = sortedBlogs.filter((p) => !p.draft)
  const postIndex = filteredBlogs.findIndex((p) => p.slug === slug)

  const prev = filteredBlogs[postIndex + 1]
  const next = filteredBlogs[postIndex - 1]
  const post = allBlogs.find((p) => p.slug === slug) as Blog
  // const authorList = post?.authors || ['default']
  // const authorDetails = authorList.map((author) => {
  //   const authorResults = allAuthors.find((p) => p.slug === author)
  //   return coreContent(authorResults as Authors)
  // })
  // const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = [
    {
      '@type': 'Person',
      name: siteMetadata.author,
    },
  ]

  const Layout = PostSimple

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout blog={post} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}
