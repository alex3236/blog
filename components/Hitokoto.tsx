const HITOKOTO_API_URL = 'https://v1.hitokoto.cn/?encode=text'

async function fetchHitokoto() {
  const response = await fetch(HITOKOTO_API_URL, {
    next: { revalidate: 300 }, // 5 minutes in seconds
  })
  if (!response.ok) {
    console.error('Error fetching Hitokoto:', response.statusText)
    return '哒哒哒...'
  }
  return await response.text()
}

export default async function Hitokoto() {
  const quote = await fetchHitokoto()

  return <span>{quote}</span>
}
