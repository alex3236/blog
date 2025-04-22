'use client'

import siteMetadata from '@/data/siteMetadata'
import Link from './Link'
import { usePathname } from 'next/navigation'
import ThemeSwitch from '@/components/ThemeSwitch'

const Header = () => {
  const isHome = usePathname() === '/'
  return (
    <>
      <header className="w-full pt-10">
        {isHome ? (
          <div className="">
            <h1 className="text-primary-600 dark:text-primary-300 font-serif text-4xl leading-10 font-bold lg:text-[2.6rem]">
              {siteMetadata.title}
            </h1>
            <div className="float-right hidden p-2.5 md:block">
              <ThemeSwitch />
            </div>
            <p className="py-2 pl-0.5 text-lg font-thin text-gray-600 lg:text-xl dark:text-gray-400">
              {siteMetadata.description}
            </p>
          </div>
        ) : (
          <>
            <div className="float-right hidden p-0.5 md:block">
              <ThemeSwitch />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              <Link
                className="text-primary-600 dark:text-primary-400 font-serif font-bold"
                href="/"
              >
                星星碎片收容所&nbsp;
              </Link>
              <br className="md:hidden" />
              <span className="font-thin md:before:content-['•_']">
                把星星揉进面团里，用月光当裱花袋～
              </span>
            </p>
          </>
        )}
      </header>
      <hr className="my-4" />
    </>
  )
}

// const HeaderBak = () => {
//   let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
//   if (siteMetadata.stickyNav) {
//     headerClass += ' sticky top-0 z-50'
//   }
//
//   return (
//     <header className={headerClass}>
//       <Link href="/" aria-label={siteMetadata.headerTitle}>
//         <div className="flex items-center justify-between">
//           <div className="mr-3">
//             <Logo />
//           </div>
//           {typeof siteMetadata.headerTitle === 'string' ? (
//             <div className="hidden h-6 text-2xl font-semibold sm:block">
//               {siteMetadata.headerTitle}
//             </div>
//           ) : (
//             siteMetadata.headerTitle
//           )}
//         </div>
//       </Link>
//       <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
//         <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
//           {navLinks
//             .filter((link) => link.href !== '/')
//             .map((link) => (
//               <Link
//                 key={link.title}
//                 href={link.href}
//                 className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100"
//               >
//                 {link.title}
//               </Link>
//             ))}
//         </div>
//         <SearchButton />
//         <ThemeSwitch />
//         <MobileNav />
//       </div>
//     </header>
//   )
// }

export default Header
