import React from 'react'
import BackgroundContainer from '../BackgroundContainer'
import UserLayout from './UserLayout'
import Background from '../../public/static/images/background-default.png'
import ProfileHead from '../ProfileHead'
import styled from 'styled-components'
import {COLORS} from '../../styles/colors'
import {SPACING} from '../../styles/spacing'
import Button from '../Button'
import {useSelector} from 'react-redux'
import userService from '../../api/request/userService'
import toast from 'react-hot-toast'

const ProfileLayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING['2X']};
  max-width: 1440px;
  width: 100%;
  margin-top: 30px;
  padding: ${SPACING.MD};

  @media (min-width: 960px) {
    flex-direction: row;
  }
`

const ProfileWrapper = styled.section`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: ${SPACING.MD};
  background-color: ${COLORS.GRAY_LIGHT_3};
  border-radius: ${SPACING.MD};
  box-shadow: 0 5px 20px ${COLORS.GRAY_LIGHT};
  gap: ${SPACING['3X']};
`

const ProfileHeadWrapper = styled.div`
  @media (min-width: 960px) {
    display: flex;
    position: relative;
    max-width: 250px;
    width: 100%;
  }
`

const ChildrenWrapper = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const VerifyMailWrapper = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.MD};
  padding: ${SPACING.SM};
  border-radius: ${SPACING.XS};
  background-color: ${COLORS.GRAY_LIGHT};
  font-size: 18px;

  @media (min-width: 960px) {
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
  }

  b {
    color: ${COLORS.RED_2};
    font-weight: 650;
  }
`

const ProfileLayout = ({children}) => {
  const user = useSelector((state) => state.user.user)

  const sendVerifyEmail = () => {
    toast.promise(userService.sendVerifyMail(), {
      loading: 'กำลังส่งเมลยืนยัน...',
      success: () => {
        return 'ส่งคำยืนยันทางอีเมลเรียบร้อยแล้ว'
      },
      error: (err) => () => {
        return `${err.toString()}`
      },
    })
  }

  return (
    <UserLayout>
      <BackgroundContainer link={Background.src}>
        <ProfileLayoutWrapper>
          <ProfileHeadWrapper>
            <ProfileHead />
          </ProfileHeadWrapper>
          <ProfileWrapper>
            <ChildrenWrapper>
              {!user.verifyEmail && (
                <VerifyMailWrapper>
                  <span>
                    <b>**บัญชีนี้ยังไม่ได้ยืนยันอีเมล</b>{' '}
                    (ยืนยันอีเมลเพื่อทำการใช้งานระบบยืมและบริจาค)
                  </span>
                  <Button
                    btnSize="sm"
                    btnType="orangeGradient"
                    onClick={sendVerifyEmail}
                  >
                    ส่งอีเมลยืนยัน
                  </Button>
                </VerifyMailWrapper>
              )}

              {children}
            </ChildrenWrapper>
          </ProfileWrapper>
        </ProfileLayoutWrapper>
      </BackgroundContainer>
    </UserLayout>
  )
}

export default ProfileLayout
