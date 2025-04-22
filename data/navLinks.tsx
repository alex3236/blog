import React from 'react'

const getValidDate = (date: string) => {
  const d = new Date(date)
  return isNaN(d.getTime()) ? null : d
}

const formatDate = (date: string, locale: string) => {
  return (
    getValidDate(date)?.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) ?? date
  )
}

const formatTime = (date: string) => {
  const d = getValidDate(date)
  const hours = String(d?.getHours()).padStart(2, '0')
  const minutes = String(d?.getMinutes()).padStart(2, '0')

  return d ? `${hours}:${minutes}` : ''
}

interface Friend {
  href: string
  imgUrl: string
  title: string
  description: React.ReactNode
}

const navLinks = [
  { href: '/blog/stardust-baking', title: '星辰烘焙手记' },
  { href: 'https://alex3236.moe/', title: '关于我' },
  { href: '/friends', title: '朋友们' },
]

const friends: Friend[] = [
  // { href: '/', imgUrl: 'https://via.placeholder.com/64', title: '星际厨房', description: <></> },
]

export { formatDate, formatTime, getValidDate, navLinks, friends }
