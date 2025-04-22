'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NotFound() {
  const router = useRouter()
  const [seconds, setSeconds] = useState(10)
  useEffect(() => {
    if (seconds <= 0) {
      router.push('/')
    } else {
      setTimeout(() => {
        setSeconds(seconds - 1)
      }, 1000)
    }
  })

  return (
    <div className="pt-6 pb-5">
      <h1 className="text-4xl leading-10 font-extrabold tracking-tight text-gray-700 sm:leading-14 xl:text-5xl dark:text-gray-200">
        ╮(๑•́ ₃•̀๑)╭
      </h1>
      <div className="p-10 text-center">
        <h3 className="text-4xl leading-18 font-bold">404</h3>
        <p>此处的星图落进了未预热的烤箱</p>
        <p>
          将在 {seconds} 秒后<Link href="/" className="font-bold text-primary-600">回到星际厨房</Link>
        </p>
      </div>
    </div>
  )
}
