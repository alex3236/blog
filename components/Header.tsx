'use client'

import siteMetadata from '@/data/siteMetadata'
import Link from './Link'
import { usePathname } from 'next/navigation'
import ThemeSwitch from '@/components/ThemeSwitch'
import Travelling from '@/components/Travelling'
import RSSButton from '@/components/RSSButton'

const LargeHeader = () => (
  <div>
    <Link
      href="/"
      className="text-primary-600 dark:text-primary-300 font-serif text-4xl leading-10 font-bold lg:text-[2.6rem]"
    >
      {siteMetadata.title}
    </Link>
    <div className="flex flex-col justify-between py-2 pl-0.5 text-gray-600 sm:flex-row sm:items-center dark:text-gray-400">
      <p className="text-lg font-thin lg:text-xl">{siteMetadata.description}</p>
      <span className="flex gap-2 pt-4 sm:gap-3 sm:pt-0">
        <Travelling />
        <RSSButton />
        <ThemeSwitch />
      </span>
    </div>
  </div>
)

const SmallHeader = () => (
  <div>
    <div className="float-right flex gap-2">
      <RSSButton />
      <ThemeSwitch />
    </div>
    <p className="text-gray-600 dark:text-gray-400">
      <Link
        className="text-primary-600 dark:text-primary-400 font-serif text-2xl font-bold"
        href="/"
      >
        {siteMetadata.title}
      </Link>
      <br className="md:hidden" />
      <span className="text-lg font-thin md:before:px-2 md:before:content-['•']">
        {siteMetadata.description}
      </span>
    </p>
  </div>
)

const Header = () => {
  const isHome = usePathname() === '/'
  return (
    <>
      <header className="w-full pt-10">{isHome ? <LargeHeader /> : <SmallHeader />}</header>
      <hr className="my-4" />
    </>
  )
}

export default Header
