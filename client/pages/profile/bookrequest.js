import Head from 'next/head'
import React from 'react'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import useMyBorrowRequest from '../../api/query/useMyBorrowRequest'
import {Icon} from '../../components'
import BookRequestCard from '../../components/cards/BookRequestCard'
import ProfileLayout from '../../components/layouts/ProfileLayout'
import {ICONS} from '../../config/icon'
import useAddressInfo from '../../hooks/useAddressInfo'
import {COLORS} from '../../styles/colors'
import {SPACING} from '../../styles/spacing'

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 12px 0;
  padding: ${SPACING.MD} ${SPACING.MD} 0;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
`

const SubTitle = styled.span`
  font-size: 14px;
  color: ${COLORS.GRAY_DARK_1};
`

const AlertText = styled.span`
  font-size: 14px;
  color: ${COLORS.RED_1};
`

const BookWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.LG};
  padding: ${SPACING.MD};
`

const EmptyState = styled.div`
  height: 100%;
  padding: ${SPACING.MD};
  background-color: ${COLORS.GRAY_LIGHT};
  border-radius: ${SPACING.MD};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  > svg {
    position: absolute;
    top: 50%;
    left: 5%;
    transform: translateY(-50%);
    opacity: 0.7;

    height: 70%;
  }

  > div {
    font-size: 28px;
    font-weight: 600;
    text-align: center;
    z-index: 2;
  }

  > p {
    text-align: center;
    z-index: 2;
  }
`

const BookRequest = () => {
  const user = useSelector((state) => state.user.user)
  const isAddressTel = useAddressInfo()
  const {data, error} = useMyBorrowRequest(isAddressTel)
  return (
    <>
      <Head>
        <title>หนังสือที่จะได้รับ</title>
      </Head>
      <TitleWrapper>
        <Title>หนังสือที่คุณได้ส่งคำขอเพื่อขอยืม</Title>
        <SubTitle>
          เมื่อคุณได้รับหนังสือแล้ว อย่าลืมมากด **ยืนยันการรับหนังสือ**
        </SubTitle>
        <AlertText>
          **หากไม่ได้รับหนังสือในเวลาที่กำหนดหรือหนังสือไม่สามารถใช้งานได้
          ผู้ใช้สามารถติดต่อผู้ดูแลระบบเพื่อขอหนังสือใหม่ได้
        </AlertText>
      </TitleWrapper>

      {data?.length > 0 ? (
        <BookWrapper>
          {data?.map((item) => (
            <BookRequestCard
              book={item}
              key={item._id}
              cardType={!item.book ? 'queue' : 'receive'}
            />
          ))}
        </BookWrapper>
      ) : (
        <EmptyState>
          <Icon name={ICONS.faBook} size="lg" color={COLORS.GRAY_LIGHT_3} />
          <div>ไม่มีคำขอยืมหนังสือของคุณในขณะนี้</div>
          <p>คุณได้รับหนังสือทั้งหมดที่คุณส่งคำขอแล้ว</p>
        </EmptyState>
      )}
    </>
  )
}

BookRequest.Layout = ProfileLayout

export default BookRequest
