import { useState, useRef, useEffect } from 'react'

interface Post {
  slug: string
  title: string
}

export default function SearchBar({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!focused) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [focused])

  const filtered = query.trim()
    ? posts.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : []

  return (
    <div ref={containerRef} className="relative w-full md:col-span-4 md:col-start-2">
      <div className="relative w-full rounded-xl border-2 border-gray-500 transition-all hover:shadow-xl dark:hover:bg-gray-800">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setFocused(true)}
          onInput={(e) => setQuery(e.currentTarget.value)}
          placeholder="搜搜搜…"
          className="block w-full rounded-xl bg-transparent px-4 py-2 text-left text-gray-700 outline-none placeholder:text-gray-500 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-gray-500 dark:text-gray-300" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
        </svg>
      </div>
      {focused && filtered.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border-2 border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {filtered.map(post => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => { setFocused(false); setQuery('') }}
            >
              {post.title}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
