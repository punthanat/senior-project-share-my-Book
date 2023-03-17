import Image from 'next/image'
import React, {useState} from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import useBorrowing from '../../api/query/useBorrowing'
import useMyBorrowRequest from '../../api/query/useMyBorrowRequest'
import userService from '../../api/request/userService'
import {COLORS} from '../../styles/colors'
import {FONTS} from '../../styles/fonts'
import {SPACING} from '../../styles/spacing'

const VerticalCard = styled.div`
  width: 200px;
  height: 225px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${SPACING.XS};
  box-shadow: 0 5px 5px ${COLORS.GRAY_LIGHT};
  padding: ${SPACING.SM};
  border-radius: ${SPACING.SM};
`

const ImageCardWrapper = styled.div`
  width: 100px;
  height: 150px;
  position: relative;
`

const BookName = styled.p`
  font-size: 12px;
  flex-grow: 1;
`

const CardBtn = styled.button`
  font-size: 12px;
  padding: 2px;
  background-color: ${COLORS.PRIMARY};
  color: ${COLORS.WHITE};
  border-radius: 4px;
  font-family: ${FONTS.PRIMARY};
  justify-self: end;

  ${(props) => props.isDisabled && 'opacity:0.4;pointer-events: none;'}
`

const BtnWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${SPACING.SM};
  padding-top: ${SPACING.MD};
`

const SubmitBtn = styled.button`
  all: unset;
  cursor: pointer;
  width: 50px;
  background-color: ${COLORS.GREEN};
  font-size: 16px;
  padding: 4px;
  border-radius: 4px;
  text-align: center;
`

const CloseBtn = styled.button`
  all: unset;
  cursor: pointer;
  width: 50px;
  background-color: ${COLORS.RED_1};
  color: ${COLORS.WHITE};
  font-size: 16px;
  padding: 4px;
  border-radius: 4px;
  text-align: center;
`

const BookRequestVerticalCard = ({bookInfo}) => {
  const [cancelModal, setCancelModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const {refetch: refetchBorrow} = useMyBorrowRequest(false)
  const {refetch: refetchBorrowing} = useBorrowing(false)

  const handleSubmit = () => {
    toast.promise(userService.confirmReceive(bookInfo?.book?._id), {
      loading: 'กำลังดำเนินการ...',
      success: () => {
        setConfirmModal(false)
        refetchBorrow()
        refetchBorrowing()
        return 'ยืนยันการรับหนังสือสำเร็จแล้ว'
      },
      error: () => {
        setConfirmModal(false)
        refetchBorrow()
        refetchBorrowing()
        return 'เกิดข้อผิดพลาด'
      },
    })
  }

  const cancelBorrowHandler = () => {
    toast.promise(userService.cancelBorrow(bookInfo.bookShelf._id), {
      loading: 'กำลังดำเนินการ...',
      success: () => {
        refetchBorrow()
        return !bookInfo.book ? 'ออกจากคิวสำเร็จ' : 'ยกเลิกการยืมสำเร็จ'
      },
      error: (err) => {
        refetchBorrow()
        return 'เกิดข้อผิดพลาด'
      },
    })
  }

  const showCancelToast = () => {
    toast.dismiss()
    return toast(
      (t) => (
        <span>
          {!bookInfo.book
            ? `ต้องการออกจากคิวของ ${bookInfo.bookShelf?.bookName} จริงๆ หรอ`
            : `ยกเลิกการยืม ${bookInfo.bookShelf?.bookName} จริงๆ หรอ`}
          <BtnWrapper>
            <SubmitBtn
              onClick={() => {
                toast.dismiss(t.id)
                cancelBorrowHandler()
              }}
            >
              ใช่
            </SubmitBtn>
            <CloseBtn onClick={() => toast.dismiss(t.id)}>ปิด</CloseBtn>
          </BtnWrapper>
        </span>
      ),
      {duration: 30000}
    )
  }

  const showReceiveToast = () => {
    toast.dismiss()
    return toast(
      (t) => (
        <span>
          {`ยืนยันการรับ ${bookInfo.bookShelf?.bookName} จริงๆ หรอ`}
          <BtnWrapper>
            <SubmitBtn
              onClick={() => {
                toast.dismiss(t.id)
                handleSubmit()
              }}
            >
              ใช่
            </SubmitBtn>
            <CloseBtn onClick={() => toast.dismiss(t.id)}>ปิด</CloseBtn>
          </BtnWrapper>
        </span>
      ),
      {duration: 30000}
    )
  }

  return (
    <>
      <VerticalCard>
        <ImageCardWrapper>
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${bookInfo.bookShelf.imageCover}`}
            alt={bookInfo.bookShelf.bookName}
            layout="fill"
            priority
          />
        </ImageCardWrapper>
        <BookName>{bookInfo.bookShelf.bookName}</BookName>
        {!bookInfo.book && (
          <CardBtn onClick={showCancelToast}>ออกจากคิว</CardBtn>
        )}
        {bookInfo?.status === 'pending' &&
          bookInfo?.book?.book?.status !== 'sending' && (
            <CardBtn isDisabled={true}>รอการจัดส่ง</CardBtn>
          )}

        {bookInfo?.book?.book?.status === 'sending' && (
          <CardBtn onClick={showReceiveToast}>ยืนยันการรับ</CardBtn>
        )}
      </VerticalCard>
    </>
  )
}

export default BookRequestVerticalCard
