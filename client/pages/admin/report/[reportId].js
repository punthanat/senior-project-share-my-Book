import React, {useState} from 'react'
import useReportInfo from '../../../api/query/useReportInfo'
import AdminLayout from '../../../components/layouts/AdminLayout'
import Button from '../../../components/Button'
import {formatDate} from '../../../utils/format'
import styled from 'styled-components'
import Icon from '../../../components/Icon'
import {ICONS} from '../../../config/icon'
import {SPACING} from '../../../styles/spacing'
import {COLORS} from '../../../styles/colors'
import useAcceptReport from '../../../api/query/useAcceptReport'
import {reportTypes} from '../../../config/reportType'
import {Divider} from '../../../components'
import {useSelector} from 'react-redux'
import useRejectReport from '../../../api/query/useRejectReport'
import useBookCanRead from '../../../api/query/useBookCanRead'
import useBookCantRead from '../../../api/query/useBookCantRead'
import useBookNotSendCantContact from '../../../api/query/useBookNotSendCantContact'
import useBookNotSendCanContact from '../../../api/query/useBookNotSendCanContact'
import useReportBookInfoEdit from '../../../api/query/useReportBookInfoEdit'
import useSystemBookNotReceive from '../../../api/query/useSystemBookNotReceive'
import useMatchUserAfterContact from '../../../api/query/useMatchUserAfterContact'
import adminService from '../../../api/request/adminService'
import toast from 'react-hot-toast'
import {useSocket} from '../../../contexts/Socket'
import {useEffect} from 'react'

const PageWrapper = styled.section`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`

const ReportId = styled.h1`
  font-size: 32px;
`

const TimeWrapper = styled.div`
  display: flex;
  gap: ${SPACING.LG};
  margin: ${SPACING.LG} 0;
`

const TimeBox = styled.div`
  width: max-content;
  display: flex;
  align-items: center;
  gap: ${SPACING.MD};
  padding: ${SPACING.SM};
  border: 1px solid ${COLORS.PRIMARY};
  border-radius: ${SPACING.XS};
  font-size: 20px;
`

const MessageHead = styled.span`
  font-size: 28px;
`

const Message = styled.p`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.MD};
  font-size: 24px;
  margin: ${SPACING.LG} 0;
  word-break: break-all;
`

const ReportCase = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.MD};
  width: max-content;
  font-size: 20px;
  margin: ${SPACING.LG} 0;
`

const AdminHandler = styled.span`
  font-size: 22px;
  color: ${(props) => (props.isSuccess ? COLORS.GREEN_3 : COLORS.RED_2)};
`

const Reporter = styled.div`
  width: max-content;
  display: flex;
  flex-direction: column;

  margin: ${SPACING.LG} 0;
`

const ReportName = styled.div`
  font-size: 22px;
`

const ReporterContact = styled.div`
  display: flex;
  gap: ${SPACING.XL};
  font-size: 18px;
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.MD};
  margin: 0 auto;
`

const ButtonHead = styled.header`
  text-align: center;
  font-size: 18px;
  margin: ${SPACING.MD} 0;
`

const ReportInfoPage = ({reportId}) => {
  const {data, refetch: refetchReport} = useReportInfo(reportId)
  const user = useSelector((state) => state.user.user)
  const reportInfo = data?.data?.data
  const isMyCase = user?._id === reportInfo?.adminWhoManage?._id
  const {mutate: acceptCase, isLoading: loadingAccept} = useAcceptReport()
  const {mutate: rejectCase, isLoading: loadingReject} = useRejectReport()
  const {mutate: bookCanRead, isLoading: loadingBookCanRead} = useBookCanRead()
  const {mutate: bookCantRead, isLoading: loadingBookCantRead} =
    useBookCantRead()
  const {
    mutate: bookNotSendCanContact,
    isLoading: loadingBookNotSendCanContact,
  } = useBookNotSendCanContact()
  const {mutate: bookInfoEdit, isLoading: loadingBookInfoEdit} =
    useReportBookInfoEdit()
  const {mutate: systemBookNotReceive, isLoading: loadingSystemBookNotReceive} =
    useSystemBookNotReceive()
  const {
    mutate: matchUserAfterContact,
    isLoading: loadingMatchUserAfterContact,
  } = useMatchUserAfterContact()
  const {socket} = useSocket()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (
      loadingAccept ||
      loadingReject ||
      loadingBookCanRead ||
      loadingBookCantRead ||
      loadingBookNotSendCanContact ||
      loadingBookInfoEdit ||
      loadingSystemBookNotReceive ||
      loadingMatchUserAfterContact
    ) {
      return setIsLoading(true)
    }
    setIsLoading(false)
  }, [
    loadingAccept,
    loadingBookCanRead,
    loadingBookCantRead,
    loadingBookInfoEdit,
    loadingBookNotSendCanContact,
    loadingMatchUserAfterContact,
    loadingReject,
    loadingSystemBookNotReceive,
  ])

  const buttonSwitch = () => {
    if (reportInfo?.status === 'reject') {
      return (
        <Button btnType="orangeGradient" onClick={() => {}}>
          รายงานนี้ถูกยกเลิกแล้ว
        </Button>
      )
    }

    if (reportInfo?.status === 'success') {
      return (
        <Button btnType="secondary" onClick={() => {}}>
          รายงานนี้สำเร็จแล้ว
        </Button>
      )
    }

    if (!isMyCase) {
      return <Button isDisabled={true}>คุณไม่ได้เป็นผู้รับดูแลเรื่องนี้</Button>
    }

    switch (reportInfo?.idType) {
      case 'bookHistoryId':
        return (
          <>
            {reportInfo?.status === 'waitHolderResponse' ? (
              <>
                <ButtonHead>**หลังจากติดต่อกับผู้ส่งเรียบร้อยแล้ว</ButtonHead>
                <ButtonWrapper>
                  <Button
                    onClick={() => matchUserAfterContact(reportId)}
                    isDisabled={isLoading}
                  >
                    จับคู่ให้ผู้ส่งใหม่
                  </Button>
                  <Button
                    btnType="orangeGradient"
                    onClick={() => {
                      if (confirm('ต้องการยกเลิกรายงานนี้ใช่ไหม')) {
                        rejectCase(reportId)
                      }
                    }}
                  >
                    ยกเลิกรายงานนี้
                  </Button>
                </ButtonWrapper>
              </>
            ) : (
              <ButtonWrapper>
                <Button
                  onClick={() =>
                    toast.promise(
                      adminService.acceptBookNotSendCantContact(reportId),
                      {
                        loading: 'กำลังดำเนินการ...',
                        success: (res) => {
                          const receiverNotification =
                            res?.data?.data?.receiverEmail ?? null
                          console.log(res?.data?.data?.receiverEmail)
                          if (receiverNotification) {
                            socket.emit('sendNotification', {
                              senderEmail: user.email,
                              receiverEmail: receiverNotification,
                              type: 'checkMailFromAdmin',
                              bookName:
                                reportInfo?.reportItem?.book?.bookShelf
                                  ?.bookName,
                            })
                          }
                          refetchReport()
                          return 'ยืนยันการส่งหนังสือสำเร็จ'
                        },
                        error: (err) => {
                          console.log(err)
                          refetchReport()
                          return 'เกิดข้อผิดพลาด'
                        },
                      }
                    )
                  }
                  btnType="secondary"
                  isDisabled={isLoading}
                >
                  ไม่สามารถติดต่อผู้ส่งได้
                </Button>
                <Button
                  onClick={() => bookNotSendCanContact(reportId)}
                  isDisabled={isLoading}
                >
                  ติดต่อผู้ส่งได้และผู้ส่งจัดส่งแล้ว
                </Button>{' '}
                <Button
                  btnType="orangeGradient"
                  onClick={() => {
                    if (confirm('ต้องการยกเลิกรายงานนี้ใช่ไหม')) {
                      rejectCase(reportId)
                    }
                  }}
                >
                  ยกเลิกรายงานนี้
                </Button>
              </ButtonWrapper>
            )}
          </>
        )
      case 'bookShelfId':
        return (
          <ButtonWrapper>
            <Button
              onClick={() =>
                window.open(`/admin/editbook/${reportInfo?.reportItem?.ISBN}`)
              }
              btnType="secondary"
              isDisabled={isLoading}
            >
              ไปแก้ไขข้อมูลหนังสือ
            </Button>
            <Button
              onClick={() => bookInfoEdit(reportId)}
              isDisabled={isLoading}
            >
              แก้ไขข้อมูลเรียบร้อยแล้ว
            </Button>
            <Button
              btnType="orangeGradient"
              onClick={() => {
                if (confirm('ต้องการยกเลิกรายงานนี้ใช่ไหม')) {
                  rejectCase(reportId)
                }
              }}
            >
              ยกเลิกรายงานนี้
            </Button>
          </ButtonWrapper>
        )
      case 'bookId':
        return (
          <>
            <ButtonHead>
              **หลังจากติดต่อเพื่อส่งข้อมูลที่จัดส่งกับผู้รายงานและได้รับหนังสือจากผู้รายงานแล้ว
            </ButtonHead>
            <ButtonWrapper>
              <Button
                onClick={() => bookCantRead(reportId)}
                btnType="secondary"
                isDisabled={isLoading}
              >
                ยืนยันสภาพหนังสือยังไม่สามารถอ่านได้
              </Button>
              <Button
                onClick={() => bookCanRead(reportId)}
                isDisabled={isLoading}
              >
                ยืนยันสภาพหนังสือยังสามารถอ่านได้
              </Button>
              <Button
                btnType="orangeGradient"
                onClick={() => {
                  if (confirm('ต้องการยกเลิกรายงานนี้ใช่ไหม')) {
                    rejectCase(reportId)
                  }
                }}
              >
                ยกเลิกรายงานนี้
              </Button>
            </ButtonWrapper>
          </>
        )
      case 'systemReportBookHis':
        return (
          <>
            <ButtonHead>**หลังจากติดต่อและผู้รับได้แล้ว</ButtonHead>
            <ButtonWrapper>
              <Button
                onClick={() => systemBookNotReceive(reportId)}
                isDisabled={isLoading}
              >
                ผู้รับกดยืนยันการรับแล้ว
              </Button>
              <Button
                btnType="orangeGradient"
                onClick={() => {
                  if (confirm('ต้องการยกเลิกรายงานนี้ใช่ไหม')) {
                    rejectCase(reportId)
                  }
                }}
              >
                ยกเลิกรายงานนี้
              </Button>
            </ButtonWrapper>
          </>
        )
      case 'waitHolderResponse':
        return <></>

      default:
        return <div></div>
    }
  }

  const reportSwitch = () => {
    switch (reportInfo?.idType) {
      case 'bookHistoryId':
        return (
          <>
            <span>
              หนังสือ
              {reportInfo?.reportItem?.book?.bookShelf?.bookName} (
              {reportInfo?.reportItem?.book?.bookShelf?.ISBN})
            </span>{' '}
            <span>
              วันที่จับคู่{' '}
              {formatDate(reportInfo?.reportItem?.matchTime, true, true, true)}{' '}
              สถานะการยืม {reportInfo?.reportItem?.status}
            </span>
            {reportInfo?.reportItem?.borrowerNeedToCancel
              ? 'ผู้ใช้เคยส่งคำขอยกเลิกการยืม'
              : ''}
            <Divider lineColor={COLORS.GRAY_LIGHT} />
            <span>
              ข้อมูลผู้ส่ง
              <br /> ชื่อ {reportInfo?.reportItem?.senderInfo?.firstname}{' '}
              {reportInfo?.reportItem?.senderInfo?.lastname} <br />
              อีเมล {reportInfo?.reportItem?.senderInfo?.email} <br />
              โทร {reportInfo?.reportItem?.senderInfo?.tel}
            </span>
          </>
        )
      case 'bookShelfId':
        return (
          <>
            <span>
              หนังสือ {reportInfo?.reportItem?.bookName} (
              {reportInfo?.reportItem?.ISBN})
            </span>{' '}
          </>
        )
      case 'bookId':
        return (
          <>
            <span>
              หนังสือ {reportInfo?.reportItem?.bookShelf?.bookName} (
              {reportInfo?.reportItem?.bookShelf?.ISBN})
            </span>
            <span>สถานะหนังสือ {reportInfo?.reportItem?.status}</span>
          </>
        )
      case 'systemReportBookHis':
        return (
          <>
            {' '}
            <span>
              หนังสือ {reportInfo?.reportItem?.book?.bookShelf?.bookName} (
              {reportInfo?.reportItem?.book?.bookShelf?.ISBN})
            </span>
            <span>สถานะการยืม {reportInfo?.reportItem?.status}</span>
            <span>
              วันที่จับคู่{' '}
              {formatDate(reportInfo?.reportItem?.matchTime, true, true, true)}{' '}
            </span>
            <span>
              วันที่จัดส่ง{' '}
              {formatDate(
                reportInfo?.reportItem?.sendingTime,
                true,
                true,
                true
              )}{' '}
            </span>
            <Divider lineColor={COLORS.GRAY_LIGHT} />
            <span>
              ข้อมูลผู้ส่ง
              <br /> ชื่อ {reportInfo?.reportItem?.senderInfo?.firstname}{' '}
              {reportInfo?.reportItem?.senderInfo?.lastname} <br />
              อีเมล {reportInfo?.reportItem?.senderInfo?.email} <br />
              โทร {reportInfo?.reportItem?.senderInfo?.tel}
            </span>
          </>
        )
      default:
        return <div>ไม่มีข้อมูล</div>
    }
  }

  return (
    <PageWrapper>
      <ReportId>
        หัวข้อ {reportTypes[reportInfo?.idType] ?? ''} <br /> รหัสรายงาน{' '}
        {reportInfo?.reportId}
      </ReportId>
      <TimeWrapper>
        <TimeBox>
          <span>
            การแก้ไขล่าสุด{' '}
            {formatDate(reportInfo?.accessTime, true, true, true)}
          </span>
          <Icon name={ICONS.faClock} />
        </TimeBox>
        <TimeBox>
          <span>
            วันที่รายงาน {formatDate(reportInfo?.reportTime, true, true, true)}
          </span>
          <Icon name={ICONS.faClock} />
        </TimeBox>
      </TimeWrapper>

      <AdminHandler isSuccess={reportInfo?.status === 'success'}>
        {reportInfo?.adminWhoManage?._id ? (
          <>
            รับเรื่องโดย {reportInfo?.adminWhoManage?.email} สถานะการรายงาน{' '}
            {reportInfo?.status}
          </>
        ) : (
          <>ยังไม่มีผู้รับรายงานนี้</>
        )}
      </AdminHandler>

      <Reporter>
        <MessageHead>รายงานโดย</MessageHead>
        <ReportName>
          {reportInfo?.userWhoReport?.firstname}{' '}
          {reportInfo?.userWhoReport?.lastname}
        </ReportName>
        <ReporterContact>
          <span> อีเมล {reportInfo?.userWhoReport?.email}</span>
          <span> โทร {reportInfo?.userWhoReport?.tel ?? '-'}</span>
        </ReporterContact>
      </Reporter>
      <Divider lineColor={COLORS.GRAY_LIGHT}></Divider>
      <Message>
        <MessageHead>รายละเอียดการรายงานจากผู้รายงาน</MessageHead>
        <span>“{reportInfo?.message}”</span>
      </Message>
      <Divider lineColor={COLORS.GRAY_LIGHT}></Divider>
      <ReportCase>
        <MessageHead>ข้อมูลเพิ่มเติม</MessageHead>
        {reportSwitch()}
      </ReportCase>
      {!reportInfo?.adminWhoManage?._id ? (
        <ButtonWrapper>
          <Button onClick={() => acceptCase(reportId)}>รับรายงาน</Button>
          <Button
            btnType="orangeGradient"
            onClick={() => {
              if (confirm('ต้องการยกเลิกรายงานนี้ใช่ไหม')) {
                rejectCase(reportId)
              }
            }}
          >
            ยกเลิกรายงานนี้
          </Button>
        </ButtonWrapper>
      ) : (
        buttonSwitch()
      )}
    </PageWrapper>
  )
}

export default ReportInfoPage
ReportInfoPage.Layout = AdminLayout

export async function getServerSideProps({params}) {
  const reportId = params.reportId

  return {
    props: {
      reportId,
    },
  }
}
