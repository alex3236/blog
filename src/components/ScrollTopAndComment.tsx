import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { siteMetadata } from "../data/siteMetadata";

export default function ScrollTopAndComment() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed right-8 bottom-8 hidden flex-col gap-3 opacity-0 transition-opacity duration-500 md:flex ${show ? "md:opacity-100" : ""}`}
    >
      <button
        aria-label="Scroll To Top"
        onClick={() => window.scrollTo({ top: 0 })}
        className="cursor-pointer rounded-full bg-gray-200 p-2 text-gray-500 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
      >
        <FaArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
