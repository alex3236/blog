'use client'

import { PhotoProvider as Provider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { ReactNode } from 'react'

const PhotoProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider maskOpacity={0.5} photoClosable={true}>
      {children}
    </Provider>
  )
}

// make the component client side
export { PhotoProvider, PhotoView }
