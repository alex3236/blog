import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="text-3xl leading-9 font-bold tracking-tight text-gray-700 md:text-4xl md:leading-16 dark:text-gray-100">
      {children}
    </h1>
  )
}
