import { FaTrainSubway } from "react-icons/fa6";

export default function Travelling() {
  return (
    <a
      href="https://www.travellings.cn/go-by-clouds.html"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center rounded-md p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
    >
      <FaTrainSubway className="mr-1 h-5 w-5" />
      <span className="relative top-[1px] text-sm">开往</span>
    </a>
  );
}
