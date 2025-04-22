'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)

  if (!siteMetadata.comments?.provider) {
    return null
  }
  return (
    <>
      {loadComments ? (
        <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
      ) : (
        <button
          onClick={() => setLoadComments(true)}
          className="border-primary-600 text-primary-600 cursor-pointer rounded-full border-2 px-6 py-2"
        >
          Load Comments
        </button>
      )}
    </>
  )
}
