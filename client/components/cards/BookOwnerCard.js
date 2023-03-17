import Image from 'next/image'
import React from 'react'
import styled, {css} from 'styled-components'
import {SPACING} from '../../styles/spacing'
import Button from '../Button'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {COLORS} from '../../styles/colors'

const SecondaryLayout = css`
  width: 100%;
  height: 400px;
  background-color: ${COLORS.GRAY_LIGHT_2};
  padding: ${SPACING.LG};
  border-radius: ${SPACING.MD};
`

const CardLayout = styled.div`
  width: 200px;
  height: 300px;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SM};

  ${(props) => props.cardType === 'secondary' && SecondaryLayout}
`

const ImageWrapper = styled.div`
  max-height: 200px;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
`

const SecondaryBookName = css`
  font-size: 18px;
  min-height: auto;
`

const BookName = styled.p`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.1em;
  min-height: 2.5em;

  ${(props) => props.cardType === 'secondary' && SecondaryBookName}
`

const Description = styled.span`
  font-size: 13px;
  flex-grow: 1;
`

const Isbn = styled.span`
  font-size: 14px;
`

const SecondaryWrapper = css`
  background-color: ${COLORS.GRAY_LIGHT_3};
  border-radius: ${SPACING.MD};
  padding: ${SPACING.MD};
  flex-grow: 1;

  > button {
    justify-self: end;
  }
`

const BookInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${SPACING.SM};

  ${(props) => props.cardType === 'secondary' && SecondaryWrapper}
`

const BookOwnerCard = ({
  bookId,
  canCancel,
  bookInfo,
  donationTime,
  onReceive,
  cardType,
}) => {
  const router = useRouter()
  return (
    <CardLayout cardType={cardType}>
      <ImageWrapper onClick={() => router.push(`/book/${bookInfo?.ISBN}`)}>
        {bookInfo?.imageCover && (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${bookInfo?.imageCover}`}
            alt={bookInfo?.bookName}
            layout="fill"
            objectFit="contain"
          ></Image>
        )}
      </ImageWrapper>
      <BookInfoWrapper cardType={cardType}>
        <BookName cardType={cardType}>{bookInfo?.bookName}</BookName>
        {cardType === 'secondary' && <Isbn>ISBN {bookInfo?.ISBN}</Isbn>}
        <Description>
          <span>วันที่บริจาค {donationTime}</span> <br />
        </Description>

        {canCancel ? (
          <Button
            btnSize="sm"
            btnType="orangeGradient"
            onClick={() =>
              onReceive(true, {bookId, bookName: bookInfo?.bookName})
            }
          >
            ยกเลิกการบริจาค
          </Button>
        ) : (
          <Button btnSize="sm" btnType="whiteBorder" isDisabled>
            หนังสือถูกส่งต่อแล้ว
          </Button>
        )}
      </BookInfoWrapper>
    </CardLayout>
  )
}

BookOwnerCard.propTypes = {
  bookInfo: PropTypes.object,
  donationDate: PropTypes.string,
  cardType: PropTypes.oneOf(['primary', 'secondary']),
}

BookOwnerCard.defaultProps = {
  cardType: 'primary',
}

export default BookOwnerCard
