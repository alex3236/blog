const formatDate = (date: string, locale: string) => {
  return new Date(date).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const formatTime = (date: string) => {
  const d = new Date(date)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

const navLinks = [
  { href: 'https://alex3236.moe/', title: 'About' },
  { href: '/friends', title: 'Friends' },
]

export { formatDate, formatTime, navLinks }
