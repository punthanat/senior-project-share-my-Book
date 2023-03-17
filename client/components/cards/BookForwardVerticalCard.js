import Image from 'next/image'
import {useRouter} from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import useBorrowing from '../../api/query/useBorrowing'
import useMyForwardRequest from '../../api/query/useMyForwardRequest'
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

const BookForwardVerticalCard = ({bookInfo}) => {
  const {refetch: getMyForward} = useMyForwardRequest(false)
  const {refetch: getBorrowing} = useBorrowing()
  const user = useSelector((state) => state?.user?.user)
  const router = useRouter()

  const submitForwarding = () => {
    if (!user.verifyEmail) {
      router.push('/profile/')
      return toast.error('กรุณายืนยันอีเมลก่อนใช้งาน')
    }

    toast.promise(userService.confirmForwarding(bookInfo.book._id), {
      loading: 'กำลังดำเนินการ...',
      success: () => {
        getMyForward()
        getBorrowing()
        return 'ยืนยันการส่งหนังสือสำเร็จ'
      },
      error: () => {
        getMyForward()
        getBorrowing()
        return 'เกิดข้อผิดพลาด'
      },
    })
  }

  const showConfirmToast = () => {
    if (!user.verifyEmail) {
      router.push('/profile/')
      return toast.error('กรุณายืนยันอีเมลก่อนใช้งาน')
    }

    toast.dismiss()
    return toast(
      (t) => (
        <span>
          {`คุณต้องการยืนยันการส่ง ${bookInfo?.book?.bookShelf?.bookName} ใช่ไหม`}
          <BtnWrapper>
            <SubmitBtn
              onClick={() => {
                toast.dismiss(t.id)
                submitForwarding()
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
            src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${bookInfo.book.bookShelf.imageCover}`}
            alt={bookInfo.book.bookShelf.bookName}
            layout="fill"
            priority
          />
        </ImageCardWrapper>
        <BookName>{bookInfo.book.bookShelf.bookName}</BookName>
        {!bookInfo.sendingTime ? (
          <CardBtn onClick={showConfirmToast}>ยืนยันการส่งต่อ</CardBtn>
        ) : (
          <CardBtn isDisabled={true}>ส่งเรียบร้อยแล้ว</CardBtn>
        )}
      </VerticalCard>
    </>
  )
}

export default BookForwardVerticalCard
