import Head from 'next/head'
import React, {useState} from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import userService from '../api/request/userService'
import {BackgroundContainer, Button} from '../components'
import Input from '../components/forms/Input'
import {ContentWrapper} from '../components/Layout'
import Background from '../public/static/images/background-default.png'
import {COLORS} from '../styles/colors'
import {SPACING} from '../styles/spacing'
import {validateEmail} from '../utils/validate'

const Title = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${COLORS.PRIMARY};
  text-align: center;
`
const Describe = styled.span`
  font-size: 20px;
  color: ${COLORS.PRIMARY};
  text-align: center;

  > b {
    font-weight: 600;
    font-size: 24px;
    letter-spacing: 0.05em;
  }
`

const FormWrapper = styled.div`
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SM};
  padding: ${SPACING.MD} 0;
`

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(false)
  const [errText, setErrText] = useState('')

  const submitForgotPassword = () => {
    if (email.length < 1 || !validateEmail(email)) {
      setErrText('กรุณากรอกอีเมลให้ถูกต้อง')
      return setError(true)
    }

    toast.promise(userService.forgotPassword(email), {
      loading: 'กำลังทำรายการ...',
      success: () => {
        setError(false)
        return 'เราได้ส่งข้อมูลการเปลี่ยนรหัสผ่านทางอีเมลของคุณแล้ว'
      },
      error: (err) => () => {
        setError(true)
        setErrText(err?.response?.data.toString())
        return `${err?.response?.data.toString()}`
      },
    })
  }

  return (
    <>
      <Head>
        <title>ลืมรหัสผ่าน - Share my Book</title>
      </Head>
      <BackgroundContainer link={Background.src}>
        <ContentWrapper
          margin="16px 0"
          width="1200px"
          maxWidth="100%"
          bgColor={COLORS.GRAY_LIGHT_1}
          padding="80px 40px"
        >
          <Title>ลืมรหัสผ่านใช่ไหม? </Title>

          <Describe>
            กรอกอีเมลที่คุณทำการสมัครบัญชี
            เราจะทำการส่งช่องทางการเปลี่ยนรหัสผ่านให้คุณทางอีเมล
          </Describe>

          <FormWrapper>
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="กรอกอีเมลของคุณ..."
              isError={error}
              errText={errText}
              errSize="16px"
            />
            <Button btnSize="sm" onClick={submitForgotPassword}>
              Submit
            </Button>
          </FormWrapper>
        </ContentWrapper>
      </BackgroundContainer>
    </>
  )
}

export default ForgotPasswordPage
