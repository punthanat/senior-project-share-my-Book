import Head from 'next/head'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import userService from '../../api/request/userService'
import {BackgroundContainer, Button} from '../../components'
import Input from '../../components/forms/Input'
import {ContentWrapper} from '../../components/Layout'
import Background from '../../public/static/images/background-default.png'
import {COLORS} from '../../styles/colors'
import {SPACING} from '../../styles/spacing'
import {validatePassword} from '../../utils/validate'

const Title = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${COLORS.PRIMARY};
  text-align: center;
`

const FormWrapper = styled.div`
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SM};
  padding: ${SPACING.MD} 0;
`

const ResetPasswordPage = ({hashId}) => {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState([])

  const submitResetPassword = () => {
    let errorArr = []

    if (!validatePassword(password)) {
      errorArr.push('confirmPassword')
      return setErrors('password')
    }

    if (password !== confirmPassword) {
      errorArr.push('confirmPassword')
      return setErrors(errorArr)
    }

    toast.promise(userService.resetPassword(hashId, password), {
      loading: 'กำลังทำรายการ...',
      success: () => {
        setErrors([])
        router.push('/')
        return 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว'
      },
      error: (err) => () => {
        console.log(err)
        return `${err?.response?.data?.toString()}`
      },
    })
  }

  return (
    <>
      <Head>
        <title>รีเซ็ตรหัสผ่าน - Share my Book</title>
      </Head>
      <BackgroundContainer link={Background.src}>
        <ContentWrapper
          margin="16px 0"
          width="1200px"
          maxWidth="100%"
          bgColor={COLORS.GRAY_LIGHT_1}
          padding="80px 40px"
        >
          <Title>กรอกรหัสผ่านใหม่ของคุณ</Title>

          <FormWrapper>
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="กรอกรหัสผ่านของคุณ..."
              isError={errors?.indexOf('password') !== -1}
              errText="กรุณากรอกรหัสผ่านที่ประกอบด้วย ตัวพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และตัวอักษรพิเศษ ความยาว 10 - 30 ตัว"
              errSize="16px"
            />

            <Input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              placeholder="กรอกรหัสผ่านของคุณ..."
              isError={errors?.indexOf('confirmPassword') !== -1}
              errText="กรุณากรอกรหัสผ่านให้ตรงกัน"
              errSize="16px"
            />

            <Button btnSize="sm" onClick={submitResetPassword}>
              เปลี่ยนรหัสผ่าน
            </Button>
          </FormWrapper>
        </ContentWrapper>
      </BackgroundContainer>
    </>
  )
}

export default ResetPasswordPage

export const getServerSideProps = async ({params}) => {
  const hashId = params.hashId
  let isVerify = false

  try {
    await userService.verifyHash(hashId).then(() => (isVerify = true))
  } catch {
    return {notFound: true}
  }

  if (!isVerify) {
    return {notFound: true}
  }

  return {
    props: {
      hashId,
    },
  }
}
