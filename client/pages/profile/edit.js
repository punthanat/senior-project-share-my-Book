import Head from 'next/head'
import React, {useState} from 'react'
import styled, {css} from 'styled-components'
import EditUserInfoForm from '../../components/forms/EditUserInfoForm'
import ProfileLayout from '../../components/layouts/ProfileLayout'
import {COLORS} from '../../styles/colors'
import {SPACING} from '../../styles/spacing'
import {useDispatch, useSelector} from 'react-redux'
import ChangePasswordForm from '../../components/forms/ChangePasswordForm'
import userService from '../../api/request/userService'
import toast from 'react-hot-toast'
import {useEffect} from 'react'
import {fetchCurrentUser, updateUser} from '../../redux/feature/UserSlice'

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 12px 0;
  padding: ${SPACING.MD} ${SPACING.MD} 0;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
`

const ActiveBtnStyle = css`
  background-color: ${COLORS.PRIMARY};
  color: ${COLORS.GRAY_LIGHT};
`

const SwitchButtonWrapper = styled.div`
  display: flex;
  gap: ${SPACING.SM};
  max-width: 100%;
  width: max-content;
  padding: ${SPACING.SM};
  background-color: ${COLORS.GRAY_LIGHT};
  border-radius: ${SPACING.SM};
  flex-wrap: wrap;
`

const SwitchButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: ${SPACING.XS} ${SPACING.SM};
  font-weight: 600;
  border-radius: ${SPACING.SM};
  transition: 0.2s;

  ${(props) => props.isActive && ActiveBtnStyle}

  &:hover {
    ${ActiveBtnStyle}
  }
`

const ErrorMessage = styled.div`
  margin-top: 12px;
  background-color: ${COLORS.RED_2};
  color: ${COLORS.WHITE};
  padding: ${SPACING.SM} ${SPACING.LG};
  border-radius: ${SPACING.XS};
  margin: 12px 24px 0;
  width: max-content;
  font-weight: 600;
`

const EditProfilePage = () => {
  const [currentView, setCurrentView] = useState('info')
  const userInfo = useSelector((state) => state?.user?.user)
  const [passwordErr, setPasswordErr] = useState('')
  const [infoErr, setInfoErr] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    setPasswordErr('')
    setInfoErr('')
  }, [currentView])

  if (Object.keys(userInfo).length < 1) {
    return <div>Loading...</div>
  }

  const submitEdit = (info) => {
    userService
      .updateInfo(info)
      .then(() => {
        toast.success('อัปเดทข้อมูลสำเร็จ')
        dispatch(fetchCurrentUser())
      })
      .catch((err) => {
        setInfoErr(err?.response?.data?.error)
      })
  }

  const submitChangePassword = (passwordData) => {
    userService
      .changePassword(passwordData.oldPassword, passwordData.newPassword)
      .then(() => {
        toast.success('เปลี่ยนรหัสผ่านสำเร็จ')
      })
      .catch((err) => toast.success('เกิดข้อผิดพลาดในการแก้รหัสผ่าน'))
  }

  return (
    <>
      <Head>
        <title>Share my Book - บริจาคหนังสือ</title>
      </Head>

      <TitleWrapper>
        <Title>แก้ไขข้อมูลบัญชีของคุณ</Title>
      </TitleWrapper>

      <SwitchButtonWrapper>
        <SwitchButton
          isActive={currentView === 'info' ? true : false}
          onClick={() => setCurrentView('info')}
        >
          ข้อมูลสำหรับการรับหนังสือ
        </SwitchButton>
        <SwitchButton
          isActive={currentView === 'password' ? true : false}
          onClick={() => setCurrentView('password')}
        >
          แก้ไขรหัสผ่าน
        </SwitchButton>
      </SwitchButtonWrapper>

      {currentView === 'info' && (
        <>
          {infoErr && <ErrorMessage>{infoErr}</ErrorMessage>}
          <EditUserInfoForm onSubmit={submitEdit} userInfo={userInfo} />
        </>
      )}

      {currentView === 'password' && (
        <>
          {passwordErr && <div>{passwordErr}</div>}
          <ChangePasswordForm onSubmit={submitChangePassword} />
        </>
      )}
    </>
  )
}

EditProfilePage.Layout = ProfileLayout

export default EditProfilePage
