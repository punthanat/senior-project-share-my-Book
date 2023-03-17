import React, {useState} from 'react'
import {Button, Icon} from './'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {ICONS} from '../config/icon'
import {SPACING} from '../styles/spacing'
import {COLORS} from '../styles/colors'
import {TYPES_STYLE} from '../config/types-styles'
import {Swiper, SwiperSlide} from 'swiper/react'
import {EffectFlip} from 'swiper'
import 'swiper/css/effect-flip'
import {useSelector} from 'react-redux'
import {animated, useSpring} from 'react-spring'
import AnimatedNumber from './springs/AnimatedNumber'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import ConfirmModal from './ConfirmModal'
import userService from '../api/request/userService'
import useBorrowing from '../api/query/useBorrowing'
import {useEffect} from 'react'
import useMyBorrowRequest from '../api/query/useMyBorrowRequest'
import useAddressInfo from '../hooks/useAddressInfo'
import ReportModal from './ReportModal'
import {useSocket} from '../contexts/Socket'

const BookContainer = styled.section`
  width: 100%;
  background-color: ${COLORS.WHITE};
  border-radius: ${SPACING.MD};
  max-width: 1200px;
  box-shadow: 0 5px 20px ${COLORS.GRAY_DARK};
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  padding: ${SPACING['4X']};

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 30px;

    > section {
      flex-grow: 1;
    }
  }
`

const BookInfoContainer = styled(animated.section)`
  display: flex;
  flex-direction: column;
`

const BookImageContainer = styled.div`
  max-height: 500px;
  width: 300px;
  flex-shrink: 0;
  align-self: center;
  transition: 0.1s;
  @media (min-width: 800px) {
    width: 320px;
  }
`

const BookImage = styled.img`
  border-radius: 16px;
  max-height: 500px;
`

const BookName = styled.h1`
  font-size: 40px;
  margin-top: ${SPACING.LG};
  color: ${COLORS.PRIMARY};
  line-height: 1.1em;
`

const ISBN = styled.h4`
  color: ${COLORS.GRAY_DARK_1};
`

const TypeContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.SM};
`

const HeadText = styled.h4`
  margin-bottom: ${SPACING.XS};
  font-weight: 600;
  color: ${COLORS.PRIMARY};
  word-break: break-all;

  ${(props) => props.size === 'sm' && smHead}
`

const TypeBox = styled.div`
  background-color: ${(props) => props.bgColor ?? COLORS.PRIMARY};
  color: ${COLORS.WHITE};
  padding: ${SPACING.SM};
  width: max-content;
  border-radius: ${SPACING.SM};
  user-select: none;
  transition: 0.1s;
  align-self: start;

  > svg {
    margin-right: ${SPACING.SM};
  }

  &:hover {
    padding: ${SPACING.MD};
  }
`

const NumberGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.MD};
  margin: ${SPACING.MD} 0;
`

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: calc(50% - 8px);
  align-self: stretch;
  justify-content: space-between;
`

const NumberTitle = styled.div`
  background: ${COLORS.GRAY_LIGHT};
  width: 100%;
  padding: ${SPACING.SM};
  border-radius: ${SPACING.SM} ${SPACING.SM} 0 0;
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: ${COLORS.PRIMARY};
  flex-grow: 1;
`

const NumberBox = styled.div`
  width: 100%;
  height: 90px;
  background: ${COLORS.PRIMARY};
  color: ${COLORS.WHITE};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 ${SPACING.SM} ${SPACING.SM};
  font-size: 32px;
  flex-direction: column;
  padding: ${SPACING.MD} 0;
`

const Unit = styled.span`
  color: ${COLORS.GRAY_LIGHT_1};
  font-size: 12px;
  margin-top: -${SPACING.SM};
`

const SectionContent = styled.section`
  display: flex;
  gap: ${SPACING.SM};
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: ${SPACING.SM} 0;
  border-radius: ${SPACING.MD};
`

const ButtonWrapper = styled.section`
  display: flex;
  margin-top: ${SPACING.MD};
  flex-grow: 1;

  > button {
    align-self: end;
  }
`

const RoundContent = styled.div`
  width: max-content;
  margin: ${SPACING.MD} 0;

  > span {
    padding: ${SPACING.SM} ${SPACING.MD};
    background-color: ${COLORS.GRAY_LIGHT};
    color: ${COLORS.PRIMARY};
    border-radius: ${SPACING.SM} 0 0 ${SPACING.SM};
    font-weight: 600;

    &:last-child {
      color: ${COLORS.GRAY_LIGHT};
      background-color: ${COLORS.PRIMARY};
      border-radius: 0 ${SPACING.SM} ${SPACING.SM} 0;
    }
  }
`

const ConfirmReminder = styled.span`
  color: ${COLORS.RED_2};
  font-size: 14px;
  font-weight: 600;
`

const ReportBtn = styled.div`
  width: max-content;
  display: flex;
  gap: ${SPACING.SM};
  align-items: center;
  color: ${COLORS.WHITE};
  padding: ${SPACING.XS} ${SPACING.SM};
  border-radius: ${SPACING.SM};
  background-color: ${COLORS.RED_2};
  font-size: 14px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

const BookInfo = ({bookInfo}) => {
  const router = useRouter()
  const isAuth = useSelector((state) => state.user.isAuth)
  const user = useSelector((state) => state.user.user)
  const isAddressTel = useAddressInfo()
  const slideIn = useSpring({
    from: {opacity: 0, y: -50},
    to: {opacity: 1, y: 0},
  })

  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const {data: borrowing, refetch: getBorrowing} = useBorrowing(
    isAuth && isAddressTel
  )
  const {data: myRequest, refetch: getMyRequest} = useMyBorrowRequest(
    isAuth && isAddressTel
  )
  const [isBorrowing, setIsBorrowing] = useState(false)
  const [isQueue, setIsQueue] = useState(false)
  const [isMaximum, setIsMaximum] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const {socket} = useSocket()

  useEffect(() => {
    if (isAuth && isAddressTel) {
      getBorrowing()
      getMyRequest()
    }
  }, [isAuth, getBorrowing, getMyRequest, isAddressTel])

  useEffect(() => {
    if (borrowing) {
      setIsBorrowing(
        borrowing?.data?.data?.borrowBooks?.some(
          (book) => book?.bookShelf?._id === bookInfo._id
        )
      )

      setIsMaximum(
        borrowing?.data?.data?.borrowBooks?.length >= 5 ? true : false
      )
    }
  }, [bookInfo._id, borrowing])

  useEffect(() => {
    if (myRequest) {
      setIsQueue(
        myRequest?.some((book) => book?.bookShelf?._id === bookInfo._id)
      )
    }
  }, [bookInfo._id, myRequest])

  const isOwner = user?.donationHistory?.some(
    (info) =>
      info?.book?.bookShelf?._id === bookInfo?._id &&
      info?.book?.currentHolder === user?._id &&
      info?.book?.bookHistorys?.length <= 2
  )

  const borrowHandler = () => {
    if (!isAuth) {
      return toast.error('กรุณาเข้าสู่ระบบก่อนยืมหนังสือ')
    }

    if (isBorrowing) {
      return toast.error('คุณถือหนังสือเล่มนี้อยู่')
    }

    if (!user.verifyEmail) {
      router.push('/profile/')
      return toast.error('กรุณายืนยันอีเมลก่อนใช้งาน')
    }

    setShowBorrowModal(true)
  }

  const borrow = () => {
    if ((isAuth && !user.address) || user.address.length < 1) {
      router.push('/profile/edit')
      return toast.error('กรุณากรอกข้อมูลบัญชีของคุณก่อน')
    }

    setIsLoading(true)

    toast.promise(userService.sendBorrowRequest(bookInfo?._id), {
      loading: 'กำลังส่งคำขอยืม...',
      success: (res) => {
        getBorrowing()
        getMyRequest()
        setIsLoading(false)
        const receiverNotification = res?.data?.data?.senderEmail ?? null
        if (receiverNotification) {
          socket.emit('sendNotification', {
            senderEmail: user.email,
            receiverEmail: receiverNotification,
            type: 'addQueue',
            bookName: bookInfo?.bookName,
          })
        }
        return bookInfo.totalAvailable > 0
          ? 'ระบบได้ส่งคำขอยืมไปยังผู้ที่ถือหนังสือแล้ว'
          : 'เข้าคิวสำเร็จแล้ว'
      },
      error: (err) => () => {
        getBorrowing()
        getMyRequest()
        setIsLoading(false)
        return `${err.toString()}`
      },
    })

    setShowBorrowModal(false)
  }

  const showReportModal = () => {
    if (!isAuth) {
      return toast.error('กรุณาเข้าสู่ระบบก่อน')
    }

    setShowReport(true)
  }

  return (
    <>
      <ReportModal
        type="bookShelfId"
        bookName={bookInfo?.bookName}
        reportId={bookInfo?._id}
        isShow={showReport}
        setIsShow={setShowReport}
      />
      <ConfirmModal
        onShow={showBorrowModal}
        icon={ICONS.faHandHoldingHand}
        onClose={() => setShowBorrowModal(false)}
      >
        <div>
          ยืนยันการยืม <b style={{fontWeight: '600'}}>{bookInfo?.bookName}</b>
        </div>
        <ConfirmReminder>
          **หลังจากกดปุ่มยืนยัน เมื่อถึงคิวของคุณในการยืม
          ระบบจะส่งข้อมูลที่อยู่การจัดส่งให้ผู้ที่ถือหนังสือทราบ
        </ConfirmReminder>
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
            onClick={() => setShowBorrowModal(false)}
            fullWidth
            borderRadius="4px"
          >
            ยกเลิก
          </Button>
          <Button btnSize="sm" onClick={borrow} fullWidth borderRadius="4px">
            ยืนยัน
          </Button>
        </div>
      </ConfirmModal>
      <BookContainer>
        <BookImageContainer>
          <Swiper
            effect={'flip'}
            grabCursor={true}
            modules={[EffectFlip]}
            className="mySwiper"
            loop={true}
          >
            <SwiperSlide>
              <BookImage
                src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${bookInfo?.imageCover}`}
              />
            </SwiperSlide>
            <SwiperSlide>
              <BookImage
                src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${bookInfo?.imageCover}`}
              />
            </SwiperSlide>
          </Swiper>
        </BookImageContainer>
        <BookInfoContainer style={slideIn}>
          <BookName style={slideIn}>{bookInfo?.bookName}</BookName>
          <ISBN>{bookInfo?.ISBN}</ISBN>
          <SectionContent padding={`${SPACING.SM} 0`}>
            <HeadText>
              <Icon name={ICONS.faPenNib} /> ผู้แต่งหนังสือ: {bookInfo.author}
            </HeadText>
            <ReportBtn onClick={showReportModal}>
              <Icon name={ICONS.faFlag} />
              <span>รายงานข้อมูลไม่ถูกต้อง</span>
            </ReportBtn>
          </SectionContent>

          <NumberGroup>
            <ContentBox>
              <NumberTitle>ยอดการยืม</NumberTitle>
              <NumberBox>
                <AnimatedNumber maxNumber={bookInfo?.totalBorrow} />
                <Unit>ครั้ง</Unit>
              </NumberBox>
            </ContentBox>

            <ContentBox>
              <NumberTitle>จำนวนที่ว่างให้ยืม</NumberTitle>
              <NumberBox>
                <AnimatedNumber maxNumber={bookInfo?.totalAvailable} />
                <Unit>เล่ม</Unit>
              </NumberBox>
            </ContentBox>
          </NumberGroup>

          <RoundContent>
            <span>สำนักพิมพ์</span>
            <span>{bookInfo?.publisherId?.publisherName}</span>
          </RoundContent>

          <HeadText> ประเภทของหนังสือ</HeadText>
          <TypeContainer>
            {bookInfo?.types?.map((type) => (
              <TypeBox
                key={`bookType-${type._id}`}
                bgColor={
                  TYPES_STYLE[type?.typeName?.replace(' ', '')?.toLowerCase()]
                    ?.color
                }
              >
                <Icon
                  name={
                    TYPES_STYLE[type?.typeName?.replace(' ', '')?.toLowerCase()]
                      ?.icon ?? TYPES_STYLE['default'].icon
                  }
                />

                {type?.typeName}
              </TypeBox>
            ))}
          </TypeContainer>

          <ButtonWrapper>
            {isOwner && (
              <Button
                btnType="whiteBorder"
                withIcon
                fullWidth
                iconName={ICONS.faBook}
                onClick={() => router.push('/profile/mydonation')}
              >
                ดูข้อมูลการบริจาคของคุณ
              </Button>
            )}

            {(!isAuth ||
              (!isOwner && !isBorrowing && !isQueue && !isMaximum)) && (
              <>
                {bookInfo.totalAvailable > 0 ? (
                  <Button
                    withIcon
                    fullWidth
                    iconName={ICONS.faBook}
                    onClick={borrowHandler}
                    isDisabled={isLoading}
                  >
                    ยืมหนังสือ
                  </Button>
                ) : (
                  <Button
                    withIcon
                    fullWidth
                    iconName={ICONS.faBook}
                    onClick={borrowHandler}
                  >
                    เข้าคิวเพื่อขอยืม (ขณะนี้มีคิวทั้งหมด{' '}
                    {bookInfo.queues.length} คิว)
                  </Button>
                )}
              </>
            )}

            {isAuth && isMaximum && !isBorrowing && (
              <Button
                withIcon
                fullWidth
                iconName={ICONS.faBook}
                btnType="whiteBorder"
              >
                คุณถือหนังสือครบ 5 เล่มแล้ว
              </Button>
            )}

            {isAuth && isQueue && (
              <Button
                withIcon
                fullWidth
                iconName={ICONS.faBook}
                onClick={() => router.push('/profile/bookrequest')}
                btnType="whiteBorder"
              >
                คุณอยู่ในคิวของหนังสือนี้แล้ว
              </Button>
            )}

            {isAuth && isBorrowing && !isOwner && (
              <Button
                withIcon
                fullWidth
                iconName={ICONS.faBook}
                onClick={() => router.push('/profile/borrowing')}
                btnType="whiteBorder"
              >
                คุณกำลังยืมหนังสือเล่มนี้อยู่
              </Button>
            )}
          </ButtonWrapper>
        </BookInfoContainer>
      </BookContainer>
    </>
  )
}

BookInfo.propTypes = {
  bookInfo: PropTypes.object,
}

export default BookInfo
