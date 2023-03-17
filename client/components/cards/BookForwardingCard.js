import React from 'react'
import styled from 'styled-components'
import userService from '../../api/request/userService'
import {COLORS} from '../../styles/colors'
import {SPACING} from '../../styles/spacing'
import Button from '../Button'
import Divider from '../Divider'
import toast from 'react-hot-toast'
import Image from 'next/image'
import {formatDate} from '../../utils/format'
import {useSelector} from 'react-redux'
import useMyForwardRequest from '../../api/query/useMyForwardRequest'
import {useSocket} from '../../contexts/Socket'
import {useRouter} from 'next/router'

const CardLayout = styled.div`
  padding: ${SPACING.MD};
  border-radius: ${SPACING.SM};
  background-color: ${COLORS.GRAY_LIGHT_1};
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SM};
  box-shadow: 0 1px 5px ${COLORS.GRAY_LIGHT};
`

const ImageWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 170px;
  border-radius: ${SPACING.SM};
  background-color: ${COLORS.GRAY_LIGHT};
  flex-shrink: 0;
  margin: 0 auto;
`

const BookHeader = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const BookName = styled.span`
  flex-basis: 75%;
  font-size: 20px;
  line-height: 24px;
  font-weight: 600;
`

const BorrowDate = styled.span`
  margin-top: ${SPACING.SM};
`
const ISBN = styled.div`
  font-weight: 600;
`

const Status = styled.span`
  flex-shrink: 0;
  font-weight: 600;
  color: ${COLORS.GREEN_3};

  ${(props) => props.type === 'waiting' && `color: ${COLORS.BLUE_LIGHT_3}`}
`

const BookInfoWrapper = styled.div`
  width: 100%;
`

const BookContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.MD};

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const AddressContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const AddressWrapper = styled.div`
  @media (min-width: 768px) {
    flex: 0 0 75%;
  }
`

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SM};

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
  }
`

const AddressHead = styled.div`
  font-weight: 600;
`

const Receiver = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.MD};
`

const SendDate = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${COLORS.GREEN_1};
`

const BookActionWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: space-between;
`

const CancelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.MD};
  background-color: ${COLORS.RED_2_LIGHT};
  margin-top: ${SPACING.SM};
  padding: ${SPACING.SM};
  border-radius: ${SPACING.XS};

  > button {
    align-self: center;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`

const CancelDescription = styled.span`
  width: 100%;
  color: ${COLORS.RED_2};

  @media (min-width: 768px) {
    width: 70%;
  }
`

const BookForwardingCard = ({bookInfo}) => {
  const {refetch: getMyForward} = useMyForwardRequest(false)
  const user = useSelector((state) => state?.user?.user)
  const {socket} = useSocket()
  const router = useRouter()

  const statusDictionary = {
    inProcess: 'รอการจัดส่ง',
    sending: 'จัดส่งแล้ว',
  }

  const submitForwarding = () => {
    if (!user.verifyEmail) {
      router.push('/profile/')
      return toast.error('กรุณายืนยันอีเมลก่อนใช้งาน')
    }

    toast.promise(userService.confirmForwarding(bookInfo.book._id), {
      loading: 'กำลังดำเนินการ...',
      success: (res) => {
        const receiverNotification = res?.data?.data?.senderEmail ?? null
        console.log(res?.data)
        if (receiverNotification) {
          socket.emit('sendNotification', {
            senderEmail: user.email,
            receiverEmail: receiverNotification,
            type: 'confirmSendingSuccess',
            bookName: bookInfo?.book?.bookShelf?.bookName,
          })
        }
        getMyForward()
        return 'ยืนยันการส่งหนังสือสำเร็จ'
      },
      error: (err) => {
        console.log(err)
        getMyForward()
        return 'เกิดข้อผิดพลาด'
      },
    })
  }

  const statusCase = () => {
    let status = bookInfo.status
    if (bookInfo.sendingTime) {
      status = 'sending'
    }

    return statusDictionary[status]
  }

  const confirmCancel = () => {
    if (!user.verifyEmail) {
      router.push('/profile/')
      return toast.error('กรุณายืนยันอีเมลก่อนใช้งาน')
    }

    toast.promise(userService.confirmCancelBorrow(bookInfo._id), {
      loading: 'กำลังดำเนินการ...',
      success: (res) => {
        console.log(res.data)
        const receiverNotification = res?.data?.data?.senderEmail ?? null
        if (receiverNotification) {
          socket.emit('sendNotification', {
            senderEmail: user.email,
            receiverEmail: receiverNotification,
            type: 'acceptCancelBorrow',
            bookName: bookInfo?.book?.bookShelf?.bookName,
          })
        }
        getMyForward()
        return 'ยกเลิกการส่งต่อนี้สำเร็จ'
      },
      error: (err) => {
        console.log(err)
        getMyForward()
        return 'เกิดข้อผิดพลาด'
      },
    })
  }

  return (
    <CardLayout>
      <BookContainer>
        <ImageWrapper>
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${bookInfo?.book?.bookShelf?.imageCover}`}
            layout="fill"
            objectFit="contain"
            alt={bookInfo?.book?.bookShelf?.bookName}
          ></Image>
        </ImageWrapper>
        <BookInfoWrapper>
          <BookHeader>
            <BookName>{bookInfo?.book?.bookShelf?.bookName}</BookName>
            <Status>{statusCase()}</Status>
          </BookHeader>
          <Divider
            lineColor={COLORS.GRAY_LIGHT}
            lineMargin={`${SPACING.SM} 0`}
          />
          <ISBN>ISBN {bookInfo?.book?.bookShelf?.ISBN}</ISBN>
          <BorrowDate>
            ได้รับคำขอยืมเมื่อ{' '}
            {formatDate(bookInfo?.matchTime, true, true, true)}
          </BorrowDate>
        </BookInfoWrapper>
      </BookContainer>

      {bookInfo.borrowerNeedToCancel && (
        <CancelWrapper>
          <CancelDescription>
            **ผู้รับได้ทำการส่งคำขอเพื่อยกเลิกการยืมหนังสือนี้จากคุณ
            กรุณากดยอมการยกเลิกหากคุณยินยอมให้ยกเลิกการยืมหนังสือนี้
          </CancelDescription>
          <Button btnSize="sm" btnType="orangeGradient" onClick={confirmCancel}>
            ยอมรับการยกเลิกยืม
          </Button>
        </CancelWrapper>
      )}
      <Divider lineColor={COLORS.GRAY_LIGHT} lineMargin={`${SPACING.SM} 0`} />
      <AddressContainer>
        <AddressWrapper>
          <AddressHead>ข้อมูลที่เกี่ยวข้องในการนำหนังสือไปส่งต่อ</AddressHead>
          <Receiver>
            <span>
              ชื่อผู้รับ {bookInfo?.receiverInfo?.firstname}{' '}
              {bookInfo?.receiverInfo?.lastname}
            </span>
            <span>โทร {bookInfo?.receiverInfo?.tel}</span>
          </Receiver>
          <p>ที่อยู่ {bookInfo?.receiverInfo?.address}</p>
        </AddressWrapper>

        <BookActionWrapper>
          {bookInfo.sendingTime && (
            <SendDate>
              ส่งวันที่ {formatDate(bookInfo.sendingTime, true, true, true)}
            </SendDate>
          )}
          <ButtonWrapper>
            {!bookInfo.sendingTime ? (
              <Button btnSize="sm" onClick={submitForwarding}>
                ยืนยันการส่งหนังสือ
              </Button>
            ) : (
              <Button btnSize="sm" btnType="orangeGradient" isDisabled={true}>
                คุณส่งหนังสือเล่มนี้แล้ว
              </Button>
            )}
          </ButtonWrapper>
        </BookActionWrapper>
      </AddressContainer>
    </CardLayout>
  )
}

export default BookForwardingCard
