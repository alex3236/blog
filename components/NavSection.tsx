import { navLinks } from '@/data/navLinks'
import Link from '@/components/Link'
import tagData from '../app/category-data.json'
import { Category } from '@/components/Tag'
import Hitokoto from '@/components/Hitokoto'

interface Props {
  title: string
  children?: React.ReactNode
}

function Section({ title, children }: Props) {
  return (
    <>
      <dl className="mt-2 sm:mt-0 sm:pr-6 sm:text-right sm:align-text-top sm:text-lg">
        <dd className="leading-6 font-medium text-gray-500 dark:text-gray-400">{title}</dd>
      </dl>
      <div className="sm:col-span-4">
        <div className="leading-8 tracking-tight text-gray-600 dark:text-gray-100">{children}</div>
      </div>
    </>
  )
}

export default function NavSection() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <nav className="mb-12">
      <h1 className="text-4xl leading-16 font-extrabold tracking-tight text-gray-700 dark:text-gray-200">
        ヾ(•ω•`)o
      </h1>

      <div className="sm:grid sm:grid-cols-5 sm:items-baseline sm:space-y-0">
        <Section title="Hitokoto">
          <p className="font-bold text-gray-600 dark:text-gray-300">
            <Hitokoto />
          </p>
        </Section>

        <Section title="Categories">
          {sortedTags.map((t) => (
            <span
              key={t}
              className="pr-3 leading-8 tracking-tight text-gray-600 before:text-gray-500 before:content-['&'] dark:text-gray-300 dark:before:text-gray-400"
            >
              <Category className="font-bold" key={t} text={t} />
            </span>
          ))}
        </Section>

        <Section title="Pages & Links">
          {navLinks.map((link) => (
            <span
              key={link.title}
              className="pr-3 leading-8 tracking-tight text-gray-600 before:content-['#'] dark:text-gray-300 dark:before:text-gray-400"
            >
              <Link className="font-bold" href={link.href}>
                {link.title}
              </Link>
            </span>
          ))}
        </Section>
      </div>
    </nav>
  )
}
