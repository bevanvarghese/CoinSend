import '../styles/globals.css'
import React from 'react'
import { TransactionProvider } from '../context/TransactionContext'

function MyApp({ Component, pageProps }) {
  return (
    <TransactionProvider>
      <Component {...pageProps} />
    </TransactionProvider>
  )
}

export default MyApp
