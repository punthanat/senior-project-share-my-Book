import Head from 'next/head'
import {useRouter} from 'next/router'
import React from 'react'
import {useEffect} from 'react'
import styled from 'styled-components'
import useMyNotificationById from '../../../api/query/useMyNotificationById'
import Button from '../../../components/Button'
import NormalBookCard from '../../../components/cards/NormalBookCard'
import Divider from '../../../components/Divider'
import Icon from '../../../components/Icon'
import ProfileLayout from '../../../components/layouts/ProfileLayout'
import {ICONS} from '../../../config/icon'
import {COLORS} from '../../../styles/colors'
import {SPACING} from '../../../styles/spacing'
import {formatDate} from '../../../utils/format'

const NotificationWrapper = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${SPACING.SM};
`

const NotificationHead = styled.h1`
  font-size: 26px;
  font-weight: 650;
`

const TimeStamp = styled.div`
  display: flex;
  gap: ${SPACING.SM};
  align-items: center;
  font-size: 18px;
`

const NotificationType = styled.h2`
  font-size: 22px;
  font-weight: 650;
  margin-bottom: ${SPACING.LG};
`

const NotificationContent = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SM};
  margin: ${SPACING.LG} 0;

  > button {
    width: max-content;
  }
`

const BookImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 220px;
`

const NotificationBookImage = styled.div`
  width: 180px;
  height: 200px;
  position: relative;
`

const ISBN = styled.span`
  text-align: center;
`

const NotificationSender = styled.span`
  font-size: 20px;
`
const NotificationFooter = styled.footer`
  margin-top: auto;
  padding: ${SPACING.SM};
  background-color: ${COLORS.GRAY_LIGHT};
  border-radius: ${SPACING.XS};
  text-align: center;
`

const NotificationInfoPage = () => {
  const router = useRouter()
  const {notificationId} = router.query

  const {data, refetch} = useMyNotificationById(notificationId, false)
  const notificationInfo = data?.data?.data?.notificationInfo
  const bookShelf = data?.data?.data?.bookShelf

  const mapNotificationTypeHead = (type) => {
    switch (type) {
      case 'addQueue':
        return `ขณะนี้มีผู้ใช้ส่งคำขอยืมหนังสือ`
      case 'cancelBorrow':
        return `ขณะนี้มีผู้ใช้ต้องการยกเลิกส่งคำขอยืมหนังสือ`
      case 'confirmSendingSuccess':
        return `ผู้ส่งได้ส่งหนังสือ`
      case 'acceptCancelBorrow':
        return `ผู้ส่งได้ยอมรับการยกเลิกยืมหนังสือ`
      case 'confirmReceiveBook':
        return `ผู้ใช้รับหนังสือแล้ว`
      case 'checkMailFromAdmin':
        return `คุณถูกรายงานว่าไม่ส่งหนังสือ`
      default:
        return
    }
  }

  const mapNotificationType = (type, bookName) => {
    switch (type) {
      case 'addQueue':
        return `มีผู้ใช้ส่งคำขอยืมหนังสือ ${bookName} มาถึงคุณ`
      case 'cancelBorrow':
        return `มีผู้ใช้ต้องการยกเลิกส่งคำขอยืมหนังสือ ${bookName}`
      case 'confirmSendingSuccess':
        return `ผู้ส่งได้ส่งหนังสือ ${bookName} แล้ว`
      case 'acceptCancelBorrow':
        return `ผู้ส่งได้ยอมรับการยกเลิกยืมหนังสือ ${bookName} แล้ว`
      case 'confirmReceiveBook':
        return `ผู้ใช้รับหนังสือ ${bookName} จากคุณแล้ว`
      case 'checkMailFromAdmin':
        return `คุณถูกรายงานว่าไม่ส่งหนังสือ ${bookName} และผู้ดูแลระบบไม่สามารถติดต่อคุณได้`
      default:
        return
    }
  }

  useEffect(() => {
    if (notificationId) {
      refetch()
    }
  }, [notificationId, refetch])

  return (
    <>
      <Head>
        <title>การแจ้งเตือนของฉัน</title>
      </Head>
      <NotificationWrapper>
        <NotificationHead>
          {mapNotificationTypeHead(notificationInfo?.type)}
        </NotificationHead>
        <NotificationType>
          {mapNotificationType(
            notificationInfo?.type,
            notificationInfo?.bookName
          )}
        </NotificationType>
        <Divider />
        <NotificationContent>
          <NormalBookCard bookInfo={bookShelf} />

          <NotificationSender>
            จากผู้ใช้ {notificationInfo?.senderEmail}
          </NotificationSender>
          <TimeStamp>
            <Icon name={ICONS.faClock} />
            <span>
              วันที่การแจ้งเตือนนี้ถูกส่ง{' '}
              {formatDate(notificationInfo?.timestamp, true, true, true)}
            </span>
          </TimeStamp>
          <TimeStamp>
            <Icon name={ICONS.faEye} />
            <span>
              วันที่เห็นการแจ้งเตือน{' '}
              {formatDate(notificationInfo?.seenTime, true, true, true)}
            </span>
          </TimeStamp>
          <Button onClick={() => router.push(`/book/${bookShelf?.ISBN}`)}>
            ดูข้อมูลหนังสือ
          </Button>
        </NotificationContent>
        <NotificationFooter>
          หากมีข้อสงสัยสามารถติดต่อเราได้ที่{' '}
          {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
        </NotificationFooter>
      </NotificationWrapper>
    </>
  )
}

NotificationInfoPage.Layout = ProfileLayout
export default NotificationInfoPage
