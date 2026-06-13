import { FaRss } from 'react-icons/fa6'

export default function RSSButton() {
  return (
    <a
      href="/feed.xml"
      aria-label="RSS Feed"
      className="flex items-center justify-center rounded-md p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
    >
      <FaRss className="h-5 w-5" />
    </a>
  )
}
