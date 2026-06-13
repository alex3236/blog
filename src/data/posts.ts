import { getCollection } from 'astro:content'
import readingTime from 'reading-time'
import { slug } from 'github-slugger'
import type { CollectionEntry } from 'astro:content'

type Post = CollectionEntry<'posts'> & {
  readingTime: ReturnType<typeof readingTime>
  tagSlugs: string[]
  categorySlug: string
  bodyText: string
}

let cachedPosts: Post[] | null = null

async function loadPosts(): Promise<Post[]> {
  if (cachedPosts) return cachedPosts
  const all = await getCollection('posts')
  cachedPosts = all.map(p => {
    const tags: string[] = Array.isArray(p.data.tags) ? p.data.tags : (typeof p.data.tags === 'string' ? [p.data.tags] : [])
    return {
      ...p,
      readingTime: readingTime(p.body || ''),
      tagSlugs: tags.map(t => slug(t)),
      categorySlug: p.data.category ? slug(p.data.category) : '',
      bodyText: p.body || '',
    } as Post
  })
  return cachedPosts
}

export async function getAllPosts(): Promise<Post[]> {
  return loadPosts()
}

export async function getPublishedPosts(): Promise<Post[]> {
  const all = await loadPosts()
  return all
    .filter(p => !p.data.draft && !p.data.page)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
}

export async function getAllSlugs(): Promise<string[]> {
  const all = await loadPosts()
  return all.filter(p => !p.data.draft).map(p => p.id)
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const all = await loadPosts()
  return all.find(p => p.id === id)
}

export async function getPostByIdIncludingDrafts(id: string): Promise<Post | undefined> {
  const all = await loadPosts()
  return all.find(p => p.id === id)
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const all = await loadPosts()
  const published = all.filter(p => !p.data.draft && !p.data.page)
  return published.filter(p => p.tagSlugs.includes(tag))
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const all = await loadPosts()
  const published = all.filter(p => !p.data.draft && !p.data.page)
  const catSlug = slug(category)
  return published.filter(p => p.categorySlug === catSlug)
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const all = await loadPosts()
  const published = all.filter(p => !p.data.draft && !p.data.page)
  const tagCounts: Record<string, number> = {}
  for (const post of published) {
    const raw = post.data.tags
    const tags: string[] = Array.isArray(raw) ? raw : (typeof raw === 'string' ? [raw] : [])
    for (const tag of tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    }
  }
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getAllCategories(): Promise<{ category: string; count: number }[]> {
  const all = await loadPosts()
  const published = all.filter(p => !p.data.draft && !p.data.page)
  const catCounts: Record<string, number> = {}
  for (const post of published) {
    if (post.data.category) {
      catCounts[post.data.category] = (catCounts[post.data.category] || 0) + 1
    }
  }
  return Object.entries(catCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getPostsByYear(year: number): Promise<Post[]> {
  const all = await loadPosts()
  const published = all.filter(p => !p.data.draft && !p.data.page)
  return published.filter(p => {
    const d = new Date(p.data.date)
    return !isNaN(d.getTime()) && d.getFullYear() === year
  })
}

export async function getAllYears(): Promise<number[]> {
  const all = await loadPosts()
  const published = all.filter(p => !p.data.draft && !p.data.page)
  const years = new Set<number>()
  for (const post of published) {
    const d = new Date(post.data.date)
    if (!isNaN(d.getTime())) years.add(d.getFullYear())
  }
  return Array.from(years).sort((a, b) => b - a)
}

export async function getAdjacentPosts(id: string): Promise<{ prev?: { id: string; title: string }; next?: { id: string; title: string } }> {
  const published = await getPublishedPosts()
  const sorted = published.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
  const idx = sorted.findIndex(p => p.id === id)
  if (idx === -1) return {}
  return {
    prev: idx > 0 ? { id: sorted[idx - 1].id, title: sorted[idx - 1].data.title } : undefined,
    next: idx < sorted.length - 1 ? { id: sorted[idx + 1].id, title: sorted[idx + 1].data.title } : undefined,
  }
}
