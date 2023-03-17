import React from 'react'
import {useRouter} from 'next/router'
import {BackgroundContainer, Button} from '../components'
import {ContentWrapper} from '../components/Layout'
import Background from '../public/static/images/background-default.png'
import {COLORS} from '../styles/colors'
import {SPACING} from '../styles/spacing'
import styled from 'styled-components'
import Image from 'next/image'
import UfoImage from '../public/static/images/ufo.jpg'
import {animated, useSpring} from 'react-spring'

const NotFoundHead = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${COLORS.PRIMARY};
  text-align: center;
`
const NotFoundDescribe = styled.span`
  font-size: 16px;
  color: ${COLORS.PRIMARY};
  text-align: center;

  > b {
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.05em;
  }
`

const NotFoundImgContainer = styled.div`
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  width: 200px;
  height: 200px;
  position: relative;
  transition: 0.2s;

  @media (min-width: 768px) {
    width: 300px;
    height: 300px;
  }
`

const NotFoundContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${SPACING.LG};
`

const NotFound = () => {
  const router = useRouter()
  const fadeIn = useSpring({
    from: {opacity: 0, y: 50},
    to: {opacity: 1, y: 0},
  })

  return (
    <BackgroundContainer link={Background.src}>
      <ContentWrapper
        margin="16px 0"
        width="1200px"
        maxWidth="100%"
        bgColor={COLORS.GRAY_LIGHT_1}
        padding="80px 40px"
      >
        <NotFoundContainer style={fadeIn}>
          <NotFoundHead> 404 - ไม่พบหน้านี้ในระบบ</NotFoundHead>
          <NotFoundImgContainer>
            <Image
              src={UfoImage.src}
              alt="UFO image"
              layout="fill"
              objectFit="cover"
            />
          </NotFoundImgContainer>

          <NotFoundDescribe>
            หน้าที่คุณกำลังเข้าถึง ไม่มีในระบบ โปรดตรวจสอบ URL
            ที่คุณกำลังเข้าถึง
          </NotFoundDescribe>

          <Button onClick={() => router.push('/')} btnType="orangeGradient">
            กลับไปหน้าหลัก
          </Button>
        </NotFoundContainer>
      </ContentWrapper>
    </BackgroundContainer>
  )
}

export default NotFound
