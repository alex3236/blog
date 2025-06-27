import Link from 'next/link'
import { FaTrainSubway } from 'react-icons/fa6'

const Travelling = () => (
  <Link
    href="https://www.travellings.cn/go-by-clouds.html"
    aria-label="开往"
    className="flex items-center justify-center rounded-md border-2 border-gray-400 p-1 text-gray-600 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <FaTrainSubway className="mr-1 h-5 w-5" />
    <span className="text-sm">开往</span>
  </Link>
)

export default Travelling
