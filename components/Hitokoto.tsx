async function fetchHitokoto(apiUrl: string, timeout: number) {
  const response = await fetch(apiUrl, {
    next: { revalidate: timeout },
  })
  if (!response.ok) {
    console.warn('Error fetching Hitokoto:', response.statusText)
    return '哒哒哒...'
  }
  return await response.text()
}

export default async function Hitokoto() {
  const quote = await fetchHitokoto('https://v1.hitokoto.cn/?encode=text', 300)

  return <span>{quote}</span>
}
