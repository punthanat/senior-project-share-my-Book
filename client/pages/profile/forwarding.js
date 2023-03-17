import Head from 'next/head'
import React from 'react'
import ProfileLayout from '../../components/layouts/ProfileLayout'
import styled, {css} from 'styled-components'
import {SPACING} from '../../styles/spacing'
import {COLORS} from '../../styles/colors'
import BookForwardingCard from '../../components/cards/BookForwardingCard'
import useMyForwardRequest from '../../api/query/useMyForwardRequest'
import {Icon} from '../../components'
import {ICONS} from '../../config/icon'
import useAddressInfo from '../../hooks/useAddressInfo'

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

const ActiveBtnStyle = css`
  background-color: ${COLORS.PRIMARY};
  color: ${COLORS.GRAY_LIGHT};
`

const SwitchButtonWrapper = styled.div`
  display: flex;
  gap: ${SPACING.SM};
  width: max-content;
  padding: ${SPACING.SM};
  background-color: ${COLORS.GRAY_LIGHT};
  border-radius: ${SPACING.SM};
`

const SwitchButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: ${SPACING.XS} ${SPACING.SM};
  font-weight: 600;
  border-radius: ${SPACING.SM};
  transition: 0.2s;

  ${(props) => props.isActive && ActiveBtnStyle}

  &:hover {
    ${ActiveBtnStyle}
  }
`

const BookWrapper = styled.div`
  width: 100%;
  height: 100%;
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

const Forwarding = () => {
  const isAddressTel = useAddressInfo()
  const {data} = useMyForwardRequest(isAddressTel)

  return (
    <>
      <Head>
        <title>หนังสือที่ต้องส่งต่อ</title>
      </Head>
      <TitleWrapper>
        <Title>หนังสือที่ต้องส่งต่อ</Title>
      </TitleWrapper>

      <BookWrapper>
        {data?.data?.data?.length > 0 ? (
          <>
            {data?.data?.data?.map((info) => (
              <BookForwardingCard key={info._id} bookInfo={info} />
            ))}
          </>
        ) : (
          <EmptyState>
            <Icon
              name={ICONS.faPaperPlane}
              size="lg"
              color={COLORS.GRAY_LIGHT_3}
            />
            <div>ไม่มีหนังสือที่คุณต้องจัดส่ง </div>
            <p>หรือคุณได้จัดส่งหนังสือทั้งหมดแล้ว</p>
          </EmptyState>
        )}
      </BookWrapper>
    </>
  )
}

Forwarding.Layout = ProfileLayout

export default Forwarding
