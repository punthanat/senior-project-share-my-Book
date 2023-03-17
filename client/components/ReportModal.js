import React, {useState} from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import userService from '../api/request/userService'
import {COLORS} from '../styles/colors'
import {FONTS} from '../styles/fonts'
import {SPACING} from '../styles/spacing'
import Button from './Button'
import Input from './forms/Input'
import {ModalBackground, ModalContainer} from './Modal'

const Title = styled.header`
  font-size: 32px;
`

const Bold = styled.span`
  font-weight: 650;
`

const BookName = styled.p`
  font-size: 20px;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${SPACING.SM};
  margin-top: 20px;
`

const ReportModal = ({isShow, setIsShow, type, bookName, reportId}) => {
  const [description, setDescription] = useState('')
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const reportTypes = {
    bookId: {
      header: 'หนังสือชำรุดเสียหาย',
    },
    bookHistoryId: {
      header: 'ไม่ได้รับหนังสือ',
    },

    bookShelfId: {
      header: 'ข้อมูลหนังสือไม่ถูกต้อง',
    },
  }

  const clearState = () => {
    setIsShow(false)
    setIsLoading(false)
    setDescription('')
  }

  const submitReport = () => {
    if (description.length < 1) {
      setIsError(true)
    } else {
      setIsError(false)
    }
    toast.promise(userService.sendReport(reportId, type, description), {
      loading: () => {
        setIsLoading(true)
        return 'กำลังส่งรายงาน...'
      },
      success: () => {
        clearState()
        return 'ส่งรายงานสำเร็จแล้ว'
      },
      error: (err) => () => {
        setIsLoading(false)
        return `${err.toString()}`
      },
    })
  }

  return (
    <>
      {isShow && (
        <ModalBackground>
          <ModalContainer maxWidth="650px" padding="16px" gap="16px">
            <Title>
              <Bold>หัวข้อรายงาน:</Bold> {reportTypes[type]?.header}
            </Title>
            <BookName>หนังสือ: {bookName}</BookName>
            <div>
              <Input
                type="text"
                placeholder="รายละเอียดการรายงาน"
                onChange={(e) => setDescription(e.target.value)}
                maxLength="300"
                value={description}
                isDisabled={isLoading}
                isError={isError}
                errText={'กรุณากรอกรายละเอียดรายงาน'}
                errSize="16px"
              />
            </div>
            <ButtonWrapper>
              <Button onClick={clearState} btnType="whiteBorder" btnSize="sm">
                ปิด
              </Button>
              <Button
                onClick={submitReport}
                btnSize="sm"
                isDisabled={isLoading}
              >
                ส่งรายงาน
              </Button>
            </ButtonWrapper>
          </ModalContainer>
        </ModalBackground>
      )}
    </>
  )
}

export default ReportModal
