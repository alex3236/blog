'use client'

import Image from 'next/image'
import React from 'react'

const Card = ({ href, imgUrl, title, children }) => {
  const handleClick = (e) => {
    e.stopPropagation()
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      role="link"
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
      tabIndex={0}
      className="cursor-pointer break-inside-avoid rounded-2xl border-3 border-sky-600 bg-sky-50 p-4 transition duration-200 hover:shadow-xl dark:border-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div className="flex">
        <div className="mr-4 flex-shrink-0">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
            <Image
              src={imgUrl}
              width={72}
              height={72}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{children}</p>
        </div>
      </div>
    </div>
  )
}

const alertTypes = {
  primary:
    'border-primary-600 bg-primary-50 text-primary-900 0 dark:bg-primary-900 dark:text-primary-300',
  blue: 'border-sky-600 bg-sky-50 text-sky-900 dark:bg-sky-900 dark:text-sky-300',
  yellow: 'border-yellow-600 bg-yellow-50 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-300',
  red: 'border-red-600 bg-red-50 text-red-900 dark:bg-red-900 dark:text-red-300',
  pink: 'border-pink-600 bg-pink-50 text-pink-900 dark:bg-pink-950 dark:text-pink-300',
}

const AlertCard = ({
  className,
  type = 'primary',
  children,
}: {
  className?: string
  children: React.ReactNode
  type: 'primary' | 'blue' | 'yellow' | 'red' | 'pink'
}) => {
  console.log(type)
  return (
    <div className={className ?? 'px-4 pt-4'}>
      <div className={`${alertTypes[type]} w-full rounded-xl border-2 px-4 py-2 text-left`}>
        {children}
      </div>
    </div>
  )
}

export { Card, AlertCard }
