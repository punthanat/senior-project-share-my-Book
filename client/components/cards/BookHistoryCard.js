import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'
import {formatDate} from '../../utils/format'

const ImageCardWrapper = styled.div`
  width: 90px;
  height: 120px;
  position: relative;
`

const BookHistoryCard = ({bookInfo}) => {
  return (
    <div>
      <ImageCardWrapper>
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${bookInfo?.book?.bookShelf?.imageCover}`}
          alt={bookInfo.book.bookShelf.bookName}
          layout="fill"
          priority
        />
      </ImageCardWrapper>
      <p>{bookInfo?.book?.bookShelf?.bookName}</p>
      <span>สถานะการยืม {bookInfo?.status}</span>
      <span>
        วันที่ได้รับ {formatDate(bookInfo?.receiveTime, true, true, true)}
      </span>
      <span>
        หมดอายุการยืม {formatDate(bookInfo?.expireTime, true, true, true)}
      </span>
    </div>
  )
}

export default BookHistoryCard
