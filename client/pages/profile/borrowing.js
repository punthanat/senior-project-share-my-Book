import React from 'react'
import styled from 'styled-components'
import ProfileLayout from '../../components/layouts/ProfileLayout'
import {COLORS} from '../../styles/colors'
import {SPACING} from '../../styles/spacing'
import Head from 'next/head'
import BorrowingCardInfo from '../../components/cards/BorrowingCardInfo'
import 'swiper/css'
import 'swiper/css/scrollbar'
import {useSelector} from 'react-redux'
import useBorrowing from '../../api/query/useBorrowing'
import {Icon} from '../../components'
import {ICONS} from '../../config/icon'
import useAddressInfo from '../../hooks/useAddressInfo'

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

const Red = styled.span`
  color: ${COLORS.RED_1};
  font-weight: 600;
`

const SwiperContainer = styled.div`
  padding-bottom: ${SPACING.MD};
  .swiper-wrapper {
    max-width: 0;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
  }

  .swiper-pointer-events {
    padding: ${SPACING.MD};
  }

  .swiper-scrollbar {
    bottom: 0px;
  }
`

const BookContainer = styled.div`
  display: grid;
  grid-template-columns: 100%;
  gap: ${SPACING['2X']};

  @media (min-width: 768px) {
    grid-template-columns: 49% 49%;
    gap: 2%;
  }
`

const BookBorrowingPage = () => {
  const user = useSelector((state) => state.user.user)
  const isAddressTel = useAddressInfo()
  const {data, error} = useBorrowing(isAddressTel)

  return (
    <>
      <Head>
        <title>หนังสือที่คุณยืมอยู่</title>
      </Head>
      <TitleWrapper>
        <Title>
          หนังสือที่คุณกำลังยืมอยู่ (
          {data?.data?.data?.borrowBooks?.length ?? 0} / 5 เล่ม){' '}
        </Title>
        <SubTitle>
          เมื่ออ่านเสร็จแล้ว คุณสามารถกด<Red>ยืนยันว่าอ่านจบแล้วได้</Red>
          เพื่อให้ผู้ที่สนใจหนังสือเล่มนี้เหมือนกันมาขอยืมต่อได้
        </SubTitle>
        {/* <SubTitle>
          <Red>
            ***หากหมดเวลาการยืมและคุณยังไม่ได้กดยืนยันว่าอ่านจบแล้ว
            ระบบจะทำการกดปุ่มให้อัตโนมัติ
          </Red>
        </SubTitle> */}
      </TitleWrapper>

      {data?.data?.data?.borrowBooks?.length > 0 ? (
        <BookContainer>
          {data?.data?.data?.borrowBooks.map((book) => (
            <BorrowingCardInfo key={book._id} info={book} />
          ))}
        </BookContainer>
      ) : (
        <EmptyState>
          <Icon name={ICONS.faBook} size="lg" color={COLORS.GRAY_LIGHT_3} />
          <div>ไม่มีหนังสือที่คุณยืมในขณะนี้</div>
          <p>ไม่มีการยืม หรือคุณได้ส่งต่อหนังสือทั้งหมดเรียบร้อยแล้ว</p>
        </EmptyState>
      )}
    </>
  )
}

BookBorrowingPage.Layout = ProfileLayout

export default BookBorrowingPage
