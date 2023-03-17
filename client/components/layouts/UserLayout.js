import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {fetchCurrentUser} from '../../redux/feature/UserSlice'
import NavigationBar from '../NavigationBar'
import Cookies from 'universal-cookie'
import {useSocket} from '../../contexts/Socket'
import toast from 'react-hot-toast'
import Icon from '../Icon'
import {ICONS} from '../../config/icon'
import styled from 'styled-components'
import useMyForwardRequest from '../../api/query/useMyForwardRequest'
import useMyBorrowRequest from '../../api/query/useMyBorrowRequest'
import {COLORS} from '../../styles/colors'
import useBorrowing from '../../api/query/useBorrowing'
import useMyNotification from '../../api/query/useMyNotification'
import useAddressInfo from '../../hooks/useAddressInfo'

const CloseToast = styled.div`
  cursor: pointer;
  font-size: 18px;
  margin-left: 8px;
`

const UserLayout = ({children}) => {
  const user = useSelector((state) => state.user.user)
  const isAuth = useSelector((state) => state.user.isAuth)
  const dispatch = useDispatch()
  const {socket} = useSocket()
  const isAddressTel = useAddressInfo()
  const {refetch: refetchForwardReq} = useMyForwardRequest(
    isAddressTel && isAuth
  )
  const {refetch: refetchBorrowReq} = useMyBorrowRequest(isAddressTel && isAuth)
  const {refetch: refetchMyNotification} = useMyNotification(isAuth)
  const {data: borrowing, refetch: refetchCurrentBorrow} = useBorrowing(
    isAddressTel && isAuth
  )

  useEffect(() => {
    const cookies = new Cookies()
    if (cookies.get('jwt')) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch])

  useEffect(() => {
    if (user.email) {
      socket?.emit('signIn', user.email)
    }

    if (!user.email) {
      toast.dismiss()
    }
  }, [user.email, socket])

  useEffect(() => {
    if (
      borrowing &&
      borrowing?.data?.data?.borrowBooks?.some(
        (item) => item.status === 'waitHolderResponse'
      )
    ) {
      toast.error(
        `มีหนังสือที่คุณถูกรายงานว่าไม่ได้ส่งต่อ โปรดติดต่อ ${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`,
        {
          duration: Infinity,
          position: 'bottom-left',
          style: {
            background: COLORS.RED_2,
            color: COLORS.WHITE,
          },
        }
      )
    }

    return () => {
      toast.dismiss()
    }
  }, [borrowing])

  useEffect(() => {
    if (socket) {
      socket.on('getNotification', (data) => {
        const toastContent = () => {
          switch (data?.type) {
            case 'addQueue':
              refetchForwardReq()
              return `ขณะนี้มีผู้ใช้ส่งคำขอยืมหนังสือ ${data?.bookName} มาถึงคุณ`
            case 'cancelBorrow':
              refetchForwardReq()
              return `ขณะนี้มีผู้ใช้ต้องการยกเลิกส่งคำขอยืมหนังสือ ${data?.bookName}`
            case 'confirmSendingSuccess':
              refetchBorrowReq()
              return `ผู้ส่งได้ส่งหนังสือ ${data?.bookName} แล้ว`
            case 'acceptCancelBorrow':
              refetchBorrowReq()
              return `ผู้ส่งได้ยอมรับการยกเลิกยืมหนังสือ ${data?.bookName} แล้ว`
            case 'confirmReceiveBook':
              refetchForwardReq()
              refetchCurrentBorrow()
              return `ผู้ใช้รับหนังสือ ${data?.bookName} จากคุณแล้ว`
            case 'checkMailFromAdmin':
              refetchForwardReq()
              refetchCurrentBorrow()
              return `มีหนังสือของคุณที่ถูกระงับการใช้งาน เนื่องจากไม่มีการส่งต่อ โปรดติดต่อผู้ดูแลระบบที่ ${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`
            default:
              return
          }
        }
        refetchMyNotification()
        toast(
          (t) => (
            <>
              <span>{toastContent()}</span>
              <CloseToast onClick={() => toast.dismiss(t.id)}>
                <Icon name={ICONS.faXmark} />
              </CloseToast>
            </>
          ),
          {
            icon: (
              <Icon
                name={ICONS.faCircleCheck}
                color={COLORS.GREEN_1}
                size={'lg'}
              />
            ),
            position: 'top-right',
            duration: 6000,
          }
        )
      })
    }

    return () => {
      socket?.off('connect')
      socket?.off('disconnect')
      socket?.off('getNotification')
    }
  }, [
    refetchBorrowReq,
    refetchCurrentBorrow,
    refetchForwardReq,
    refetchMyNotification,
    socket,
  ])

  return (
    <>
      <NavigationBar />
      {children}
    </>
  )
}

export default UserLayout
