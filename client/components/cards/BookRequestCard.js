import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COLORS} from '../../styles/colors'
import {SPACING} from '../../styles/spacing'
import Button from '../Button'
import Divider from '../Divider'
import {useState} from 'react'
import ConfirmModal from '../ConfirmModal'
import {ICONS} from '../../config/icon'
import userService from '../../api/request/userService'
import {formatDate} from '../../utils/format'
import Image from 'next/image'
import toast from 'react-hot-toast'
import useMyBorrowRequest from '../../api/query/useMyBorrowRequest'
import ReportModal from '../ReportModal'
import {useSelector} from 'react-redux'
import {useRouter} from 'next/router'
import {useSocket} from '../../contexts/Socket'

const CardContainer = styled.div`
  padding: ${SPACING.MD};
  border-radius: ${SPACING.SM};
  background-color: ${COLORS.GRAY_LIGHT_1};
  display: flex;
  flex-direction: column;
  gap: ${SPACING.MD};
  box-shadow: 0 1px 5px ${COLORS.GRAY_LIGHT};

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${SPACING.SM};
  flex-shrink: 0;
`

const ImageContainer = styled.div`
  width: 140px;
  height: 170px;
  background-color: ${COLORS.GRAY_LIGHT_2};
  border-radius: ${SPACING.SM};
  position: relative;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ISBN = styled.span`
  text-align: center;
  font-weight: 600;
`

const BookHeader = styled.div`
  display: flex;
  justify-content: space-between;
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

const LimitReceive = styled.span`
  font-size: 16px;
  color: ${COLORS.GRAY_DARK_3};

  > b {
    font-size: 18px;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: ${SPACING.MD};
  margin: ${SPACING.LG} 0 0;

  @media (min-width: 1024px) {
    flex-direction: row;
    margin: auto 0 0;
  }
`

const Status = styled.span`
  flex-shrink: 0;
  font-weight: 600;
  color: ${COLORS.GREEN_3};

  ${(props) => props.type === 'waiting' && `color: ${COLORS.BLUE_LIGHT_3}`}
`

const BookRequestCard = ({book, cardType}) => {
  const [confirmModal, setConfirmModal] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const {refetch: refetchBorrow} = useMyBorrowRequest(false)
  const user = useSelector((state) => state?.user?.user)
  const router = useRouter()
  const {socket} = useSocket()
  const mapStatus = {
    pending: 'รอการจัดส่ง',
    inProcess: 'รอการจัดส่ง',
    sending: 'ผู้ส่งจัดส่งแล้ว',
    holding: 'ได้รับหนังสือแล้ว',
    unavailable: 'หนังสือถูกพักการใช้งาน',
  }

  const handleSubmit = () => {
    if (!user.verifyEmail) {
      router.push('/profile/')
      return toast.error('กรุณายืนยันอีเมลก่อนใช้งาน')
    }

    toast.promise(userService.confirmReceive(book?.book?.book?._id), {
      loading: 'กำลังดำเนินการ...',
      success: (res) => {
        setConfirmModal(false)
        const receiverNotification = res?.data?.data?.senderEmail ?? null
        if (receiverNotification) {
          socket.emit('sendNotification', {
            senderEmail: user.email,
            receiverEmail: receiverNotification,
            type: 'confirmReceiveBook',
            bookName: book?.bookShelf?.bookName,
          })
        }
        refetchBorrow()
        return 'ยืนยันการรับหนังสือสำเร็จแล้ว'
      },
      error: () => {
        setConfirmModal(false)
        refetchBorrow()
        return 'เกิดข้อผิดพลาด'
      },
    })
  }

  const cancelBorrowHandler = () => {
    if (!user.verifyEmail) {
      router.push('/profile/')
      return toast.error('กรุณายืนยันอีเมลก่อนใช้งาน')
    }

    const successTxt = (() => {
      if (book?.status === 'pending' && book?.book?.status !== 'sending') {
        return 'ส่งคำขอยกเลิกการยืมไปยังผูัส่งเรียบร้อยแล้ว'
      } else if (cardType === 'queue') {
        return 'ออกจากคิวสำเร็จ'
      }
      return 'ยกเลิกการยืมสำเร็จ'
    })()

    toast.promise(
      userService.cancelBorrow(book.bookShelf._id, book?.book?._id ?? null),
      {
        // ส่ง bookHistory id ด้วย
        loading: 'กำลังดำเนินการ...',
        success: (res) => {
          const receiverNotification = res?.data?.data?.senderEmail ?? null
          if (receiverNotification) {
            socket.emit('sendNotification', {
              senderEmail: user.email,
              receiverEmail: receiverNotification,
              type: 'cancelBorrow',
              bookName: book?.bookShelf?.bookName,
            })
          }
          setCancelModal(false)
          refetchBorrow()
          return successTxt
        },
        error: () => {
          setCancelModal(false)
          refetchBorrow()
          return 'เกิดข้อผิดพลาด'
        },
      }
    )
  }

  return (
    <>
      <ReportModal
        type="bookHistoryId"
        bookName={book?.bookShelf?.bookName}
        reportId={book?.book?._id}
        isShow={showReport}
        setIsShow={setShowReport}
      />

      <ConfirmModal
        onClose={setConfirmModal}
        onShow={confirmModal}
        header={`ยืนยันการได้รับหนังสือ ${book?.bookShelf?.bookName}`}
        icon={ICONS.faBook}
        iconBg={COLORS.GREEN_1}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            width: '70%',
          }}
        >
          <Button
            btnSize="sm"
            bgColor={COLORS.RED_1}
            onClick={() => setConfirmModal(false)}
            fullWidth
            borderRadius="4px"
          >
            ยกเลิก
          </Button>
          <Button
            btnSize="sm"
            onClick={handleSubmit}
            fullWidth
            borderRadius="4px"
          >
            ยืนยัน
          </Button>
        </div>
      </ConfirmModal>

      <ConfirmModal
        onClose={setCancelModal}
        onShow={cancelModal}
        header={
          cardType === 'queue'
            ? `ต้องการออกจากคิวของ ${book.bookShelf?.bookName} จริงๆ หรอ`
            : `ยกเลิกการยืม ${book.bookShelf?.bookName} จริงๆ หรอ`
        }
        icon={ICONS.faBook}
        iconBg={COLORS.GREEN_1}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            width: '70%',
          }}
        >
          <Button
            btnSize="sm"
            bgColor={COLORS.RED_1}
            onClick={() => setCancelModal(false)}
            fullWidth
            borderRadius="4px"
          >
            ยกเลิก
          </Button>
          <Button
            btnSize="sm"
            onClick={cancelBorrowHandler}
            fullWidth
            borderRadius="4px"
          >
            ยืนยัน
          </Button>
        </div>
      </ConfirmModal>

      <CardContainer>
        <ImageWrapper>
          <ImageContainer>
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${book.bookShelf?.imageCover}`}
              layout="fill"
              objectFit="contain"
              alt={book?.bookShelf?.bookName}
            ></Image>
          </ImageContainer>
          <ISBN>ISBN {book?.bookShelf?.ISBN}</ISBN>
        </ImageWrapper>
        <ContentWrapper>
          <BookHeader>
            <BookName>{book?.bookShelf?.bookName}</BookName>
            {cardType === 'queue' ? (
              <Status type="waiting">อยู่ในคิว</Status>
            ) : (
              <Status type="waiting">
                {mapStatus[book?.book?.book?.status]}
              </Status>
            )}
          </BookHeader>

          <Divider
            lineColor={COLORS.GRAY_LIGHT}
            lineMargin={`${SPACING.SM} 0`}
          />

          {cardType === 'queue' ? (
            <>
              <BorrowDate>
                วันที่เข้าคิว :{' '}
                {formatDate(book?.requestTime, true, true, true)}
              </BorrowDate>
              <LimitReceive>
                ขณะนี้คุณอยู่ในคิวที่ <b>{book?.queuePosition + 1}</b>
              </LimitReceive>
            </>
          ) : (
            <>
              <BorrowDate>
                วันที่ขอยืม : {formatDate(book?.requestTime, true, true, true)}
              </BorrowDate>
              <LimitReceive>
                จะได้รับภายในวันที่ :{' '}
                {formatDate(new Date(book?.requestTime).setHours(72))}
              </LimitReceive>
            </>
          )}

          <ButtonWrapper>
            {cardType === 'queue' ? (
              <>
                <Button
                  btnSize="sm"
                  btnType="orangeGradient"
                  onClick={() => setCancelModal(true)}
                >
                  ออกจากคิว
                </Button>
              </>
            ) : (
              <>
                {book?.status === 'waiting' ||
                  (book?.status === 'pending' &&
                    book?.book?.book?.status !== 'sending' &&
                    !book?.book?.borrowerNeedToCancel && (
                      <>
                        <Button
                          btnSize="sm"
                          onClick={() => setShowReport(true)}
                          btnType="orangeGradient"
                        >
                          แจ้งไม่ได้รับหนังสือ
                        </Button>
                        <Button
                          btnSize="sm"
                          onClick={() => setCancelModal(true)}
                        >
                          ยกเลิกการยืม
                        </Button>
                      </>
                    ))}
                {book?.book?.book?.status === 'sending' && (
                  <>
                    <Button
                      btnSize="sm"
                      onClick={() => setShowReport(true)}
                      btnType="orangeGradient"
                    >
                      แจ้งไม่ได้รับหนังสือ
                    </Button>
                    <Button
                      btnSize="sm"
                      onClick={() =>
                        setConfirmModal({
                          type: 'receive',
                          show: true,
                        })
                      }
                    >
                      ยืนยันการรับหนังสือ
                    </Button>
                  </>
                )}
                {book?.book?.borrowerNeedToCancel &&
                  book?.book?.book?.status !== 'sending' && (
                    <>
                      <Button
                        btnSize="sm"
                        onClick={() => setShowReport(true)}
                        btnType="orangeGradient"
                      >
                        แจ้งไม่ได้รับหนังสือ
                      </Button>
                      <Button btnSize="sm" isDisabled={true}>
                        ส่งคำขอยกเลิกแล้ว
                      </Button>
                    </>
                  )}
              </>
            )}
          </ButtonWrapper>
        </ContentWrapper>
      </CardContainer>
    </>
  )
}

BookRequestCard.propTypes = {
  bookInfo: PropTypes.object,
  cardType: PropTypes.oneOf(['receive', 'queue']),
}

BookRequestCard.defaultProps = {
  cardType: 'receive',
}

export default BookRequestCard
