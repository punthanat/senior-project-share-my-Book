import React from 'react'
import styled from 'styled-components'
import {COLORS} from '../../styles/colors'
import {SPACING} from '../../styles/spacing'
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import Button from '../Button'
import Image from 'next/image'
import useConfirmReadingSuccess from '../../api/query/useConfirmReadingSuccess'
import ConfirmModal from '../ConfirmModal'
import {useState} from 'react'
import {ICONS} from '../../config/icon'
import toast from 'react-hot-toast'
import useBorrowing from '../../api/query/useBorrowing'
import userService from '../../api/request/userService'
import {formatDate} from '../../utils/format'
import ReportModal from '../ReportModal'

const CardContainer = styled.div`
  min-height: 400px;
  padding: ${SPACING.MD};
  border-radius: ${SPACING.SM};
  background-color: ${COLORS.GRAY_LIGHT_1};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${SPACING.MD};
  box-shadow: 0 1px 5px ${COLORS.GRAY_LIGHT};

  @media (min-width: 1300px) {
    min-height: auto;
    height: 270px;
    flex-direction: row;
  }

  ${(props) => props.isExpired && `background-color: ${COLORS.GRAY_LIGHT_2}; `}
`

const ImageWrapper = styled.div`
  width: 120px;
  height: 150px;
  background-color: ${COLORS.GRAY_LIGHT};
  border-radius: ${SPACING.MD};
  flex-shrink: 0;
  position: relative;
`

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Description = styled.div`
  flex-grow: 1;
`

const BookName = styled.div`
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 2px;
  border: solid ${COLORS.GRAY_LIGHT};
  border-width: 0 0 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`
const CircleProgress = styled.div`
  width: 220px;
  height: 220px;
  flex-shrink: 0;
`

const BookDateInfo = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${SPACING.XS};
`

const GetBookDate = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${SPACING.MD} 0;
  font-size: 13px;
  line-height: 18px;

  > b {
    font-weight: 600;
  }

  > span {
    ${(props) => props.isExpired && `color: ${COLORS.RED_2};font-weight: 600`}
  }
`

const EventMessage = styled.div`
  color: ${COLORS.WHITE};
  background-color: ${COLORS.RED_2};
  opacity: 0.65;
  padding: 2px ${SPACING.SM};
  text-align: center;
  margin: 0 0 2px;

  ${(props) => props.successRead && `background-color:${COLORS.GREEN_1};`}
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SM};
`

const BorrowingCardInfo = ({info}) => {
  const [showModal, setShowModal] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const {refetch: getBorrowing} = useBorrowing(false)

  const expireDay = Math.round(
    (new Date(info.bookHistorys.expireTime).getTime() - new Date().getTime()) /
      (1000 * 3600 * 24)
  )

  const isExpired =
    new Date(Date.now()).getTime() >
    new Date(info.bookHistorys.expireTime).getTime()

  const handleSubmit = () => {
    toast.promise(userService.confirmReadingSuccess(info._id), {
      loading: 'กำลังดำเนินการ...',
      success: () => {
        setShowModal(false)
        getBorrowing()
        return 'ยืนยันการอ่านสำเร็จ'
      },
      error: () => {
        setShowModal(false)
        getBorrowing()
        return 'เกิดข้อผิดพลาด'
      },
    })
  }

  const switchEventMessage = () => {
    switch (info?.status) {
      case 'holding':
        if (isExpired) {
          return <EventMessage>หมดเวลาการยืมหนังสือนี้แล้ว</EventMessage>
        } else {
          return
        }
      case 'waitHolderResponse':
        return (
          <EventMessage>
            หนังสือไม่ถูกส่งต่อ โปรดติดต่อ{' '}
            {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
          </EventMessage>
        )
      default:
        if (isExpired) {
          return (
            <EventMessage successRead={true}>
              ถือหนังสือไว้เพื่อรอผู้ที่สนใจยืมต่อ
            </EventMessage>
          )
        } else {
          return
        }
    }
  }

  return (
    <>
      <ReportModal
        type="bookId"
        bookName={info?.bookShelf?.bookName}
        reportId={info?._id}
        isShow={showReport}
        setIsShow={setShowReport}
      />

      <ConfirmModal
        onClose={setShowModal}
        onShow={showModal}
        header={`คุณยืนยันการได้รับหนังสือ ${info?.bookShelf?.bookName} แล้วใช่ไหม`}
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
            onClick={() => setShowModal(false)}
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
      <CardContainer isExpired={isExpired}>
        <CircleProgress>
          <CircularProgressbarWithChildren
            value={(14 - expireDay) * 7.14}
            strokeWidth={6}
            styles={buildStyles({
              pathColor: COLORS.PRIMARY,
              backgroundColor: COLORS.GRAY_LIGHT_2,
            })}
            background
          >
            <ImageWrapper>
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${info.bookShelf?.imageCover}`}
                layout="fill"
                objectFit="contain"
                alt={info?.bookShelf?.bookName}
              ></Image>
            </ImageWrapper>
          </CircularProgressbarWithChildren>
        </CircleProgress>
        <ContentWrapper>
          <Description>
            <BookName>{info.bookShelf.bookName}</BookName>
            {switchEventMessage()}
            <BookDateInfo>
              <GetBookDate>
                <span>
                  {formatDate(info.bookHistorys.receiveTime, true, true, true)}
                </span>
                <b>วันที่ได้รับหนังสือ</b>
              </GetBookDate>
              <br />
              <GetBookDate isExpired={isExpired}>
                <span>
                  {formatDate(info.bookHistorys.expireTime, true, true, true)}
                </span>
                <b>วันที่หมดอายุการยืม</b>
              </GetBookDate>
            </BookDateInfo>
          </Description>
          <ButtonWrapper>
            {info.status === 'holding' ? (
              <>
                <Button
                  btnSize="sm"
                  borderRadius="0"
                  onClick={() => setShowModal(true)}
                >
                  ยืนยันว่าคุณอ่านหนังสือจบแล้ว
                </Button>
                <Button
                  btnSize="sm"
                  borderRadius="0"
                  btnType="orangeGradient"
                  onClick={() => setShowReport(true)}
                >
                  แจ้งหนังสือเสียหาย
                </Button>
              </>
            ) : (
              <>
                <Button
                  btnSize="sm"
                  borderRadius="0"
                  btnType="whiteBorder"
                  isDisabled={true}
                >
                  คุณอ่านหนังสือเล่มนี้จบแล้ว
                </Button>
                <Button
                  btnSize="sm"
                  borderRadius="0"
                  btnType="orangeGradient"
                  isDisabled={true}
                >
                  แจ้งหนังสือเสียหาย
                </Button>
              </>
            )}
          </ButtonWrapper>
        </ContentWrapper>
      </CardContainer>
    </>
  )
}

export default BorrowingCardInfo
