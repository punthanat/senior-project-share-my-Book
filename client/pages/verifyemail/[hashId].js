import Head from 'next/head'
import {useRouter} from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'
import userService from '../../api/request/userService'
import {BackgroundContainer, Button} from '../../components'
import {ContentWrapper} from '../../components/Layout'
import Background from '../../public/static/images/background-default.png'
import {fetchCurrentUser} from '../../redux/feature/UserSlice'
import {COLORS} from '../../styles/colors'
import {SPACING} from '../../styles/spacing'

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
  margin-bottom: ${SPACING['4X']};

  > b {
    font-weight: 600;
    font-size: 24px;
    letter-spacing: 0.05em;
  }
`

const VerifyEmailPage = ({user, hashId}) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const verifyMail = () => {
    toast.promise(userService.submitVerifyMail(hashId), {
      loading: 'กำลังทำรายการ...',
      success: () => {
        dispatch(fetchCurrentUser())
        router.push('/')
        return 'ยืนยันอีเมลสำเร็จ'
      },
      error: (err) => () => {
        return `${err.toString()}`
      },
    })
  }

  return (
    <>
      <Head>
        <title>ยืนยันอีเมล - Share my Book</title>
      </Head>
      <BackgroundContainer link={Background.src}>
        <ContentWrapper
          margin="16px 0"
          width="1200px"
          maxWidth="100%"
          bgColor={COLORS.GRAY_LIGHT_1}
          padding="80px 40px"
        >
          <Title>ยืนยันอีเมลนี้ : {user.email}</Title>

          <Describe>ยืนยันอีเมลเพื่อใช้งานระบบ</Describe>

          <Button onClick={verifyMail}>ยืนยันอีเมลนี้</Button>
        </ContentWrapper>
      </BackgroundContainer>
    </>
  )
}

export default VerifyEmailPage

export const getServerSideProps = async ({params}) => {
  const hashId = params.hashId
  let user = {}

  try {
    const userInfo = await userService
      .getUserEmailByHash(hashId)
      .then((res) => res?.data?.data)
    user = userInfo
  } catch {
    return {notFound: true}
  }

  if (Object.keys(user).length < 1) {
    return {notFound: true}
  }

  return {
    props: {
      user,
      hashId,
    },
  }
}
