import { useEffect, useState } from 'react'

export default function Hitokoto() {
  const [quote, setQuote] = useState('加载中...')

  useEffect(() => {
    fetch('https://v1.hitokoto.cn/?encode=text')
      .then(res => res.ok ? res.text() : '哒哒哒...')
      .then(setQuote)
      .catch(() => setQuote('哒哒哒...'))
  }, [])

  return <span>{quote}</span>
}
