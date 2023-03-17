import React from 'react'
import styled, {css} from 'styled-components'
import {FONTS} from '../styles/fonts'
import {COLORS} from '../styles/colors'
import {SPACING} from '../styles/spacing'
import {useSelector} from 'react-redux'
import Link from 'next/link'
import {useRouter} from 'next/router'
import BookWorm from '../public/static/images/bookworm.png'
import {useOutsideAlerter} from '../hooks/useOutsideAlerter'
import Image from 'next/image'
import {ModalBackground} from './Modal'
import {useState} from 'react'
import Button from './Button'
import {useRef} from 'react'
import Icon from './Icon'
import {ICONS} from '../config/icon'
import useBorrowing from '../api/query/useBorrowing'
import useMyBorrowRequest from '../api/query/useMyBorrowRequest'
import useMyForwardRequest from '../api/query/useMyForwardRequest'
import useAddressInfo from '../hooks/useAddressInfo'
import useMyNotification from '../api/query/useMyNotification'
import {animated, useTransition} from 'react-spring'

const UserProfile = styled.div`
  width: 100%;
  display: flex;
  gap: ${SPACING.MD};
  padding: ${SPACING.SM};
  border-radius: ${SPACING.MD};
  color: ${COLORS.GRAY_LIGHT_2};

  @media (min-width: 960px) {
    color: ${COLORS.BLACK};
  }
`

const Circle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
`

const UserNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: ${FONTS.SARABUN};
  overflow: hidden;
`

const UserName = styled.h2`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 22px;
  font-weight: 800;
`

const NavActive = css`
  background-color: ${COLORS.GRAY_DARK_5};
  color: ${COLORS.WHITE};
`

const NavMenu = styled.ul`
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.GRAY_LIGHT_2};
  width: 100%;
  border-radius: ${SPACING.MD};
  gap: ${SPACING.LG};
  padding: ${SPACING.MD};
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: ${SPACING.SM};
  }

  &::-webkit-scrollbar {
    background-color: ${COLORS.GRAY_LIGHT};
  }

  &::-webkit-scrollbar-thumb {
    background: ${COLORS.GRAY_DARK};
    border-radius: 5px;

    &:hover {
      background: ${COLORS.GRAY_DARK_1};
    }
  }
`

const NavItem = styled.li`
  flex-shrink: 0;
  ${(props) => props.isActive && NavActive}
  padding: ${SPACING.SM} ${SPACING.LG};
  border-radius: ${SPACING.MD};
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    ${NavActive}
  }
`

const ProfileHeadContainer = styled.div`
  width: 100%;
  padding: ${SPACING.MD};
  border-radius: ${SPACING.MD};
  background-color: ${COLORS.GRAY_DARK_6};
  box-shadow: 0 5px 20px ${COLORS.GRAY_DARK_1};

  @media (min-width: 960px) {
    border-radius: ${SPACING.MD};
    background-color: ${COLORS.WHITE};
  }
`

const ProfilePosition = css`
  left: 0;
  opacity: 1;
  pointer-events: auto;
`

const ProfileWrapper = styled.div`
  width: 100%;
  top: 80px;
  left: -800px;
  position: fixed;
  z-index: 2000;
  opacity: 0;
  padding: ${SPACING.MD};
  transition: 0.2s;
  pointer-events: none;

  ${(props) => props.trigger && ProfilePosition}
  @media
    (min-width: 960px) {
    ${ProfilePosition}
    position: relative;
    padding: 0;
    z-index: 0;
    top: 0;
  }
`

const HideDesktop = styled.span`
  @media (min-width: 960px) {
    display: none;
  }
`

const ButtonWrapper = styled.div`
  padding-top: ${SPACING.MD};
  margin-bottom: ${SPACING.MD};
`

const CountNumber = styled(animated.div)`
  padding: ${SPACING.XS} ${SPACING.SM};
  color: ${COLORS.WHITE};
  background-color: ${(props) => (props.noti ? COLORS.RED_2 : COLORS.PRIMARY)};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${SPACING.XS};
  font-weight: 600;
`

const ProfileHead = () => {
  const user = useSelector((state) => state.user.user)
  const isAuth = useSelector((state) => state.user.isAuth)
  const router = useRouter()
  const [isTriggerMenu, setIsTriggerMenu] = useState(false)
  const isAddressTel = useAddressInfo()
  const {data: borrowing} = useBorrowing(isAddressTel)
  const {data: bookRequest} = useMyBorrowRequest(isAddressTel)
  const {data: bookForwarding} = useMyForwardRequest(isAddressTel)
  const {data: myNotification} = useMyNotification(isAuth)

  const MenuRef = useRef()
  useOutsideAlerter(setIsTriggerMenu, MenuRef)

  const fadeUnseenSpring = useTransition(
    myNotification?.data?.data?.unseenCount > 0,
    {
      from: {opacity: 0},
      enter: {opacity: 1},
      leave: {opacity: 0},
    }
  )

  return (
    <>
      <HideDesktop>
        <Button
          btnSize="sm"
          borderRadius="12px "
          onClick={() => setIsTriggerMenu(true)}
        >
          เมนู
        </Button>
      </HideDesktop>
      {isTriggerMenu && (
        <HideDesktop>
          <ModalBackground></ModalBackground>
        </HideDesktop>
      )}

      <ProfileWrapper trigger={isTriggerMenu}>
        <HideDesktop>
          <ButtonWrapper>
            <Button
              btnSize="sm"
              borderRadius="12px "
              onClick={() => setIsTriggerMenu(false)}
            >
              <span>ปิดเมนู</span> <Icon name={ICONS.faXmark} />
            </Button>
          </ButtonWrapper>
        </HideDesktop>
        <ProfileHeadContainer ref={MenuRef}>
          <UserProfile>
            <Circle>
              <Image
                src={BookWorm.src}
                alt="bookworm icon"
                objectFit="contain"
                layout="fill"
              ></Image>
            </Circle>
            <UserNameContainer>
              <span>สวัสดี, คุณ</span>
              <UserName>{user?.firstname ?? user?.email}</UserName>
            </UserNameContainer>
          </UserProfile>
          <NavMenu>
            <Link href="/profile" passHref>
              <NavItem
                isActive={router.pathname === '/profile'}
                onClick={() => setIsTriggerMenu(false)}
              >
                ข้อมูลโดยรวม
              </NavItem>
            </Link>
            <Link href="/profile/notification" passHref>
              <NavItem
                isActive={router.pathname === '/profile/notification'}
                onClick={() => setIsTriggerMenu(false)}
              >
                <span>การแจ้งเตือนทั้งหมด</span>
                {myNotification?.data?.data?.unseenCount > 0 && (
                  <CountNumber noti={true} style={fadeUnseenSpring}>
                    {myNotification?.data?.data?.unseenCount}
                  </CountNumber>
                )}
              </NavItem>
            </Link>

            <Link href="/profile/bookrequest" passHref>
              <NavItem
                isActive={router.pathname === '/profile/bookrequest'}
                onClick={() => setIsTriggerMenu(false)}
              >
                <span>คำขอยืมหนังสือของคุณ</span>
                {bookRequest?.length > 0 && (
                  <CountNumber>{bookRequest?.length ?? 0}</CountNumber>
                )}
              </NavItem>
            </Link>
            <Link href="/profile/borrowing" passHref>
              <NavItem
                isActive={router.pathname === '/profile/borrowing'}
                onClick={() => setIsTriggerMenu(false)}
              >
                <span>หนังสือที่กำลังยืม</span>
                {borrowing?.data?.data?.borrowBooks?.length > 0 && (
                  <CountNumber>
                    {borrowing?.data?.data?.borrowBooks?.length ?? 0}
                  </CountNumber>
                )}
              </NavItem>
            </Link>
            <Link href="/profile/forwarding" passHref>
              <NavItem
                isActive={router.pathname === '/profile/forwarding'}
                onClick={() => setIsTriggerMenu(false)}
              >
                <span>หนังสือที่ต้องส่งต่อ</span>
                {bookForwarding?.data?.data?.length > 0 && (
                  <CountNumber>
                    {bookForwarding?.data?.data?.length ?? 0}
                  </CountNumber>
                )}
              </NavItem>
            </Link>
            <Link href="/profile/mydonation" passHref>
              <NavItem
                isActive={router.pathname === '/profile/mydonation'}
                onClick={() => setIsTriggerMenu(false)}
              >
                ประวัติการบริจาค
              </NavItem>
            </Link>
            <Link href="/profile/borrowhistory" passHref>
              <NavItem
                isActive={router.pathname === '/profile/borrowhistory'}
                onClick={() => setIsTriggerMenu(false)}
              >
                ประวัติการยืม
              </NavItem>
            </Link>

            <Link href="/profile/myreport" passHref>
              <NavItem
                isActive={router.pathname === '/profile/myreport'}
                onClick={() => setIsTriggerMenu(false)}
              >
                การรายงานของฉัน
              </NavItem>
            </Link>

            <Link href="/profile/edit" passHref>
              <NavItem
                isActive={router.pathname === '/profile/edit'}
                onClick={() => setIsTriggerMenu(false)}
              >
                แก้ไขข้อมูล
              </NavItem>
            </Link>
          </NavMenu>
        </ProfileHeadContainer>
      </ProfileWrapper>
    </>
  )
}

export default ProfileHead
