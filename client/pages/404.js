import Head from 'next/head'
import React from 'react'
import NotFound from '../components/NotFound'

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>404 - ไม่พบหน้านี้ในระบบ</title>
      </Head>
      <NotFound />
    </>
  )
}

export default NotFoundPage
