import {useRouter} from 'next/router'
import React from 'react'
import styled, {css} from 'styled-components'
import {TYPES_STYLE} from '../config/types-styles'
import {COLORS} from '../styles/colors'
import {FONTS} from '../styles/fonts'
import {SPACING} from '../styles/spacing'
import Button from './Button'
import Image from 'next/image'
import PropTypes from 'prop-types'
import {useSelector} from 'react-redux'
import {useSpring, animated} from 'react-spring'
import Link from 'next/link'

const Card = styled.div`
  display: flex;
  padding: ${SPACING.LG};
  gap: ${SPACING.SM};
  overflow: hidden;
  border-radius: ${SPACING.SM};
  background-color: ${COLORS.WHITE};
  transition: 0.3s;
  user-select: none;

  &:hover {
    box-shadow: 0 5px 20px ${COLORS.GRAY_LIGHT};
  }

  @media (min-width: 1024px) {
    width: 100%;
  }
`

const BookImageContainer = styled.div`
  width: 110px;
  height: 150px;
  border-radius: ${SPACING.MD};
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
`

const BookInfoContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const BookName = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  font-size: 20px;
  font-weight: 600;
  max-height: 40px;
  line-height: 20px;
  color: ${COLORS.PRIMARY};
  cursor: pointer;

  ${(props) => props.isLong && 'font-size: 16px;'}
`

const Types = styled(animated.div)`
  margin: ${SPACING.XS} 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.XS};
`

const TypeSmStyle = css`
  font-size: 10px;
  padding: 0 ${SPACING.SM};
`

const Type = styled.div`
  font-size: 11px;
  background-color: ${(props) => props.color ?? COLORS.PRIMARY};
  color: ${COLORS.WHITE};
  border-radius: ${SPACING.MD};
  padding: 1px 6px;
  width: max-content;
  ${(props) => props.size === 'sm' && TypeSmStyle}
`

const BorrowCountWrapper = styled.div`
  display: flex;
  gap: ${SPACING.MD};
`

const BorrowCount = styled.span`
  font-size: 12px;
  color: ${(props) => props.color ?? COLORS.GRAY_DARK_1};
  font-weight: 400;
  font-family: ${FONTS.SARABUN};

  b {
    font-weight: 600;
  }
`

const BottomZone = styled(animated.div)`
  flex-grow: 1;
  display: flex;
  align-items: end;

  > * {
    width: 100%;
  }
`

const BookCard = ({bookInfo}) => {
  const router = useRouter()
  const user = useSelector((state) => state.user.user)

  const isOwner = user?.donationHistory?.some(
    (info) =>
      info?.book?.bookShelf?._id === bookInfo?._id &&
      info?.book?.currentHolder === user?._id &&
      info?.book?.bookHistorys?.length <= 2
  )

  const slideIn = useSpring({
    from: {opacity: 0, x: 50},
    to: {opacity: 1, x: 0},
  })

  return (
    <Card>
      <Link href={`/book/${bookInfo?.ISBN}`} passHref>
        <BookImageContainer>
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${bookInfo?.imageCover}`}
            alt={bookInfo?.bookName}
            layout="fill"
            objectFit="cover"
          />
        </BookImageContainer>
      </Link>
      <BookInfoContainer>
        <Link href={`/book/${bookInfo?.ISBN}`} passHref>
          <BookName isLong={bookInfo?.bookName.length > 30}>
            {bookInfo?.bookName}
          </BookName>
        </Link>
        <Types style={slideIn}>
          {bookInfo?.types?.map((type) => (
            <Type
              key={`bookType-${type?._id}`}
              color={
                TYPES_STYLE[type?.typeName?.replace(' ', '')?.toLowerCase()]
                  ?.color
              }
              size={bookInfo?.types.length > 3 ? 'sm' : ''}
            >
              {type?.typeName}
            </Type>
          ))}
        </Types>

        <BorrowCountWrapper>
          <BorrowCount>
            <span>การยืม</span> {bookInfo?.totalBorrow.toLocaleString('en-US')}{' '}
            ครั้ง
          </BorrowCount>
          <BorrowCount color={COLORS.PRIMARY}>
            <span>
              เหลือ <b>{bookInfo?.totalAvailable.toLocaleString('en-US')}</b>{' '}
              เล่ม
            </span>
          </BorrowCount>
        </BorrowCountWrapper>

        <BottomZone style={slideIn}>
          {isOwner && (
            <Button
              btnSize="sm"
              btnType="whiteBorder"
              onClick={() => router.push(`/profile/mydonation`)}
            >
              ดูข้อมูลการบริจาค
            </Button>
          )}
          {!isOwner && (
            <Button
              btnSize="sm"
              onClick={() => router.push(`/book/${bookInfo?.ISBN}`)}
            >
              ข้อมูลหนังสือ
            </Button>
          )}
        </BottomZone>
      </BookInfoContainer>
    </Card>
  )
}

export default BookCard

BookCard.propTypes = {
  bookInfo: PropTypes.object,
}
