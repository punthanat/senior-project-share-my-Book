import React from 'react'
import AddBookForm from '../../../components/forms/AddBookForm'
import {useRouter} from 'next/router'
import shelfService from '../../../api/request/shelfService'
import AdminLayout from '../../../components/layouts/AdminLayout'
import styled from 'styled-components'
import {SPACING} from '../../../styles/spacing'
import Head from 'next/head'

const Wrapper = styled.div`
  padding: ${SPACING.LG} 0;
`

const Title = styled.h2`
  font-size: 32px;
  font-weight: 600;
`

const BookEditPage = () => {
  const router = useRouter()
  const bookIsbn = router.query.isbn

  const editBookShelf = (bookData, imageFile) => {
    shelfService.editShelf(bookData, imageFile).then((res) => {
      if (res.success) {
        router.push(`/admin/search`)
      } else {
        alert(res.error)
      }
    })
  }

  return (
    <>
      <Head>
        <title>ADMIN - แก้ไขข้อมูลหนังสือ</title>
      </Head>
      <Wrapper>
        <Title>คุณกำลังแก้ไขข้อมูลหนังสือ</Title>
        <AddBookForm
          isbnBookToEdit={bookIsbn}
          onPrevious={() => router.push(`/admin/search`)}
          onSubmit={editBookShelf}
        ></AddBookForm>
      </Wrapper>
    </>
  )
}

export default BookEditPage

BookEditPage.Layout = AdminLayout
