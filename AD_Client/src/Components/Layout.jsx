import React from 'react'
import Nav from './Nav'
import FOOT from './Footer'
import './Layout.css'
export function Layout ({children}) {
  return (
    <div>
        <Nav/>
        {children}
        <FOOT/>
    </div>
  )
}
