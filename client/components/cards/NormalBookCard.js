import {useRouter} from 'next/router'
import React from 'react'
import styled, {css} from 'styled-components'
import {TYPES_STYLE} from '../../config/types-styles'
import {COLORS} from '../../styles/colors'
import {FONTS} from '../../styles/fonts'
import {SPACING} from '../../styles/spacing'
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

  flex-direction: column;
  align-items: center;

  &:hover {
    box-shadow: 0 5px 20px ${COLORS.GRAY_LIGHT};
  }

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: start;
  }

  @media (min-width: 1024px) {
    width: 100%;
  }
`

const BookImageContainer = styled.div`
  width: 120px;
  height: 160px;
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
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  font-size: 20px;
  font-weight: 600;
  max-height: 40px;
  line-height: 20px;
  color: ${COLORS.PRIMARY};
  cursor: pointer;
`

const ISBN = styled.div`
  font-size: 18px;
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

const NormalBookCard = ({bookInfo}) => {
  console.log(bookInfo)
  const user = useSelector((state) => state.user.user)

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
          <BookName>{bookInfo?.bookName}</BookName>
        </Link>

        <ISBN>ISBN {bookInfo?.ISBN}</ISBN>

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
      </BookInfoContainer>
    </Card>
  )
}

export default NormalBookCard

NormalBookCard.propTypes = {
  bookInfo: PropTypes.object,
}
