import React, {useRef, useState} from 'react'
import styled, {css} from 'styled-components'
import {COLORS} from '../styles/colors'
import Icon from './Icon'
import {ICONS, ICON_SIZE} from '../config/icon'
import {SPACING} from '../styles/spacing'
import {useRouter} from 'next/router'
import AuthModal from './AuthModal'
import {useDispatch, useSelector} from 'react-redux'
import userService from '../api/request/userService'
import {clearUser} from '../redux/feature/UserSlice'
import {useOutsideAlerter} from '../hooks/useOutsideAlerter'
import toast from 'react-hot-toast'
import {FONTS} from '../styles/fonts'
import Link from 'next/link'
import Drawer from './Drawer'
import useMyForwardRequest from '../api/query/useMyForwardRequest'
import useMyBorrowRequest from '../api/query/useMyBorrowRequest'
import useBorrowing from '../api/query/useBorrowing'
import useAddressInfo from '../hooks/useAddressInfo'
import useMyNotification from '../api/query/useMyNotification'
import {formatDate} from '../utils/format'
import useSeenNotification from '../api/query/useSeenNotification'
import {useSocket} from '../contexts/Socket'
import {animated, useSpring, useTransition} from 'react-spring'
import {useEffect} from 'react'

const NavigationBarStyled = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: ${COLORS.WHITE};
  height: 60px;
  box-shadow: 0 5px 30px ${COLORS.GRAY_LIGHT};
  z-index: 1000;
  padding: 5px ${SPACING.MD};
`

const ContentWrapper = styled.ul`
  margin: auto;
  max-width: 900px;
  height: 100%;
  ${(props) =>
    props.isAuth
      ? 'display: none;'
      : `margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;`}

  @media (min-width: 768px) {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

const ActiveStyled = css`
  color: ${COLORS.PRIMARY};
  opacity: 1;
`

const MenuIcon = styled.li`
  height: 45px;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.XS};
  justify-content: space-between;
  font-size: 14px;
  transition: 0.2s;
  color: ${COLORS.GRAY_DARK};
  position: relative;
  opacity: 0.8;
  ${(props) => props.isActive && ActiveStyled}

  > * {
    user-select: none;
  }

  svg {
    height: 18px;
  }

  &:hover {
    cursor: pointer;
    ${ActiveStyled}
  }
`

const MenuDropdown = styled.ul`
  position: absolute;
  background-color: ${COLORS.GRAY_LIGHT_1};
  padding: ${SPACING.SM};
  width: 220px;
  border-radius: ${SPACING.MD};
  box-shadow: 0 5px 20px ${COLORS.GRAY_LIGHT};
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SM};
  right: 0;
`

const MenuItem = styled.li`
  padding: ${SPACING.SM} ${SPACING.MD};
  width: 100%;
  border-radius: ${SPACING.MD};
  transition: 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: ${COLORS.GRAY_DARK_5};
    color: ${COLORS.WHITE};
  }
`

const MenuContentWrapper = styled.div`
  display: flex;
  gap: 4px;
`

const NotificationDropdown = styled.ul`
  width: 97vw;
  padding: ${SPACING.SM};
  position: fixed;
  right: 0;
  background-color: ${COLORS.GRAY_LIGHT_1};
  border-radius: ${SPACING.MD};
  box-shadow: 0 5px 20px ${COLORS.GRAY_LIGHT};
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SM};

  @media (min-width: 700px) {
    width: 350px;
    position: absolute;
    right: -50%;
  }
`

const NotificationItem = styled.li`
  padding: ${SPACING.SM};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.XS};
  font-family: ${FONTS.SARABUN};
  color: ${COLORS.GRAY_DARK};
  border: 1px solid ${COLORS.GRAY_LIGHT};
  border-width: 0 0 1px;
  transition: 0.2s;

  > div > svg {
    margin-right: ${SPACING.SM};
  }

  &:last-of-type {
    border: 0;
  }

  &:hover {
    color: ${COLORS.GRAY_DARK_5};
  }
`

const ViewMoreNotification = styled.div`
  font-weight: 600;
  color: ${COLORS.PURPLE_1};
`

const ViewAllNotification = styled.div`
  text-align: center;
  font-weight: 600;
  color: ${COLORS.GRAY_DARK_5};

  &:hover {
    text-decoration: underline;
  }
`

const NotiIconControl = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

const DrawerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 768px) {
    display: none;
  }
`
const UserName = styled.div`
  font-size: 16px;
  max-width: 100px;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const CustomHomeIcon = styled.div`
  cursor: pointer;
`

const CountNumber = styled.span`
  padding: ${SPACING.XS} ${SPACING.SM};
  color: ${COLORS.WHITE};
  background-color: ${COLORS.RED_2};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${SPACING.XS};
  font-weight: 600;
`

const CirCleCount = styled(animated.div)`
  width: 20px;
  flex-shrink: 0;
  color: ${COLORS.WHITE};
  background-color: ${COLORS.RED_2};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-weight: 600;
  font-size: 12px;
`

const NavigationBar = () => {
  const router = useRouter()
  const isAuth = useSelector((state) => state.user.isAuth)
  const user = useSelector((state) => state.user.user)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotificationMenu, setShowNotificationMenu] = useState(false)
  const dispatch = useDispatch()
  const profileRef = useRef()
  useOutsideAlerter(setShowProfileMenu, profileRef, 'mouseover')
  const notificationRef = useRef()
  const notificationIconRef = useRef()
  const isAddressTel = useAddressInfo()
  const {data: borrowing} = useBorrowing(isAddressTel && isAuth)
  const {data: bookRequest} = useMyBorrowRequest(isAddressTel && isAuth)
  const {data: bookForwarding} = useMyForwardRequest(isAddressTel && isAuth)
  const {data: myNotification} = useMyNotification(isAuth)
  const {mutate: seenNotification} = useSeenNotification()
  const {socket} = useSocket()

  const notificationHandler = (bool, event) => {
    if (!isAuth) {
      return
    }

    if (
      showNotificationMenu &&
      notificationIconRef?.current?.contains(event.target)
    ) {
      return setShowNotificationMenu(false)
    }
    if (bool) {
      let unseenList = myNotification?.data?.data?.notificationList
        ?.slice(0, 5)
        ?.filter((item) => !item.seen)

      if (unseenList.length > 0) {
        seenNotification(unseenList)
      }
    }

    setShowNotificationMenu(bool)
  }

  useOutsideAlerter(notificationHandler, notificationRef)

  const logoutHandler = async () => {
    if (router.pathname.includes('profile')) {
      router.push('/')
    }

    const getResult = async () => await userService.logout()
    setShowProfileMenu(false)
    return getResult()
      .then(() => {
        socket.on('logout', () => {})
        dispatch(clearUser())
        toast.success('ออกจากระบบสำเร็จ')
      })
      .catch(() => {
        toast.success('ออกจากระบบสำเร็จ')
        dispatch(clearUser())
        return router.push('/')
      })
  }

  const menuList = [
    {
      icon: ICONS.faHandHoldingHand,
      text: 'บริจาคหนังสือ',
      link: '/profile/donatebook',
    },
    {icon: ICONS.faUser, text: 'ข้อมูลของฉัน', link: '/profile'},
    {icon: ICONS.faBell, text: 'การแจ้งเตือน', link: '/profile/notification'},
    {icon: ICONS.faBook, text: 'หนังสือที่ยืมอยู่', link: '/profile/borrowing'},
    {
      icon: ICONS.faExclamationCircle,
      text: 'การรายงาน',
      link: '/profile/myreport',
    },
    {icon: ICONS.faSignOut, text: 'ออกจากระบบ', function: logoutHandler},
  ]

  const mapNotificationType = (type, bookName) => {
    switch (type) {
      case 'addQueue':
        return `ขณะนี้มีผู้ใช้ส่งคำขอยืมหนังสือ ${bookName} มาถึงคุณ`
      case 'cancelBorrow':
        return `ขณะนี้มีผู้ใช้ต้องการยกเลิกส่งคำขอยืมหนังสือ ${bookName}`
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

  const boopingSpring = useSpring({
    config: {tension: 1000, friction: 50},
    from: {scaleX: 0, scaleY: 0},
    to: [
      {scaleX: 1.2, scaleY: 1.2},
      {scaleX: 1, scaleY: 1},
    ],
  })

  return (
    <>
      <AuthModal show={showAuthModal} setShow={setShowAuthModal} />
      <NavigationBarStyled>
        <ContentWrapper isAuth={isAuth}>
          <MenuIcon
            onClick={() => router.push('/')}
            isActive={router.pathname === '/'}
          >
            <Icon name={ICONS.faHome} size={ICON_SIZE.lg} />
            หน้าหลัก
          </MenuIcon>

          {isAuth ? (
            <>
              <MenuIcon
                onClick={() => router.push('/profile/donatebook')}
                isActive={router.pathname === '/profile/donatebook'}
              >
                <Icon name={ICONS.faHandHoldingHand} size={ICON_SIZE.lg} />
                บริจาคหนังสือ
              </MenuIcon>

              <MenuIcon
                onClick={() => router.push('/profile/borrowing')}
                isActive={router.pathname === '/profile/borrowing'}
              >
                <Icon name={ICONS.faBook} size={ICON_SIZE.lg} />
                <MenuContentWrapper>
                  หนังสือที่ยืมอยู่{' '}
                  {borrowing?.data?.data?.borrowBooks?.length > 0 && (
                    <CirCleCount style={boopingSpring}>
                      {borrowing?.data?.data?.borrowBooks?.length ?? 0}
                    </CirCleCount>
                  )}
                </MenuContentWrapper>
              </MenuIcon>

              <MenuIcon ref={notificationRef} isActive={showNotificationMenu}>
                <NotiIconControl ref={notificationIconRef}>
                  <Icon name={ICONS.faBell} size={ICON_SIZE.lg} />
                  <MenuContentWrapper>
                    การแจ้งเตือน
                    {myNotification?.data?.data?.unseenCount > 0 && (
                      <CirCleCount style={boopingSpring}>
                        {myNotification?.data?.data?.unseenCount}
                      </CirCleCount>
                    )}
                  </MenuContentWrapper>
                </NotiIconControl>
                {showNotificationMenu && (
                  <NotificationDropdown>
                    {myNotification?.data?.data?.notificationList
                      ?.slice(0, 5)
                      ?.map((item) => (
                        <NotificationItem
                          key={item?._id}
                          onClick={() =>
                            router.push(`/profile/notification/${item?._id}`)
                          }
                        >
                          <div>
                            <Icon name={ICONS.faHandHoldingHand} />
                            <span>
                              {mapNotificationType(item?.type, item?.bookName)}
                            </span>
                          </div>
                          <ViewMoreNotification>
                            {formatDate(item?.timestamp, true, true, true)}
                          </ViewMoreNotification>
                        </NotificationItem>
                      ))}

                    <NotificationItem>
                      <Link href="/profile/notification" passHref>
                        <ViewAllNotification>
                          <Icon name={ICONS.faBell} />
                          ดูการแจ้งเตือนทั้งหมด
                        </ViewAllNotification>
                      </Link>
                    </NotificationItem>
                  </NotificationDropdown>
                )}
              </MenuIcon>

              <MenuIcon
                isActive={router.pathname === '/profile'}
                ref={profileRef}
              >
                <Icon name={ICONS.faUser} size={ICON_SIZE.lg} />
                <UserName>{user?.firstname ?? user?.email}</UserName>
                {showProfileMenu && (
                  <MenuDropdown>
                    <MenuItem
                      onClick={() => {
                        setShowProfileMenu(false)
                        router.push('/profile')
                      }}
                    >
                      <span>ข้อมูลของฉัน</span>
                      {(bookRequest?.length ?? 0) +
                        (bookForwarding?.data?.data?.length ?? 0) >
                        0 && (
                        <CountNumber>
                          {(bookRequest?.length ?? 0) +
                            (bookForwarding?.data?.data?.length ?? 0)}
                        </CountNumber>
                      )}
                    </MenuItem>
                    <MenuItem onClick={logoutHandler}>ออกจากระบบ</MenuItem>
                  </MenuDropdown>
                )}
              </MenuIcon>
            </>
          ) : (
            <MenuIcon onClick={() => setShowAuthModal(true)}>
              <Icon name={ICONS.faSignIn} size={ICON_SIZE.lg} />
              เข้าสู่ระบบ
            </MenuIcon>
          )}
        </ContentWrapper>

        {isAuth && (
          <DrawerWrapper>
            <Link href="/" passHref>
              <CustomHomeIcon>
                <Icon name={ICONS.faHome} size={'lg'}></Icon>
              </CustomHomeIcon>
            </Link>
            <Drawer itemList={menuList}></Drawer>
          </DrawerWrapper>
        )}
      </NavigationBarStyled>
    </>
  )
}

export default NavigationBar
