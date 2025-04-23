import Link from './Link'
import siteMetadata from '@/data/siteMetadata'

export default function Footer() {
  return (
    <footer>
      <hr className="my-3" />
      <div className="lg:text-md mb-12 text-sm text-gray-500 dark:text-gray-400">
        <div className="float-left flex leading-none">
          <p>
            <Link href="/" className="font-bold">
              {siteMetadata.title}
            </Link>
            .
          </p>
        </div>
        <div className="flex justify-end">
          {siteMetadata.icp && (
            <Link href={siteMetadata.icp.url} className="font-bold">
              {siteMetadata.icp.text}
            </Link>
          )}
        </div>
        <div className="flex justify-end">
          © {new Date().getFullYear()}
          &nbsp;
          <span className="font-bold">{siteMetadata.author}</span>.&nbsp;
          <Link href={siteMetadata.siteRepo}>Next × Moricolor</Link>.
        </div>
      </div>
    </footer>
  )
}
