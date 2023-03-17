import React, {useState, useEffect, useRef} from 'react'
import styled, {css} from 'styled-components'
import {useOutsideAlerter} from '../hooks/useOutsideAlerter'
import LoginForm from './forms/LoginForm'
import RegisterForm from './forms/RegisterForm'
import {ModalBackground, ModalContainer} from './Modal'
import RegisterBanner from '../public/static/images/register-banner.png'
import LoginBanner from '../public/static/images/people-group-reading.jpg'
import Image from 'next/image'
import {useTransition, a} from 'react-spring'
import {COLORS} from '../styles/colors'

const PageBanner = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 20px 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: ${COLORS.WHITE};
`

const BannerImage = styled.div`
  width: 300px;
  height: 200px;
  position: relative;

  @media (min-width: 768px) {
    width: 500px;
    height: 400px;
  }
`

const BannerHeader = styled.div`
  text-align: center;
  > div {
    font-size: 20px;
    font-weight: 600;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const RegisterModal = css`
  margin-top: 180px;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`

const ResponsiveModal = styled(a.div)`
  ${(props) => props.showregister && RegisterModal}
`

const AuthModal = ({show, setShow}) => {
  const [showregister, setShowregister] = useState(false)
  const modalRef = useRef()
  const slideModal = useTransition(show, {
    from: {opacity: 0, y: 0},
    enter: {opacity: 1, y: 425},
    leave: {opacity: 0, y: 0},
  })

  const setCloseModal = (isInside) => {
    if (!isInside) {
      setShow(false)
      setShowregister(false)
    }
  }

  useOutsideAlerter(setCloseModal, modalRef)

  useEffect(() => {
    if (show) {
      document.body.style.position = 'fixed'
      document.body.style.width = '100vw'
    } else {
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [show])

  return (
    <>
      {show && (
        <ModalBackground>
          {slideModal((style, item) =>
            item ? (
              <ResponsiveModal
                style={style}
                showregister={showregister ? 'yes' : null}
              >
                <ModalContainer
                  maxWidth="975px"
                  maxHeight="max-content"
                  ref={modalRef}
                >
                  {showregister ? (
                    <ContentWrapper>
                      <PageBanner>
                        <BannerHeader>
                          <div>ร่วมเป็นส่วนหนึ่งกับเราได้ง่ายๆ</div>
                          <span>เพียงกรอกข้อมูลเพื่อสมัครสมาชิก~</span>
                        </BannerHeader>

                        <BannerImage>
                          <Image
                            alt="login-banner"
                            src={RegisterBanner}
                            layout="fill"
                            objectFit="contain"
                          />
                        </BannerImage>

                        <BannerHeader>
                          <div>บริการยืมหนังสือ</div>
                          <span>
                            และบริจาคหนังสือเพื่อร่วมกันสร้างสังคมแห่งการแบ่งปัน
                          </span>
                        </BannerHeader>
                      </PageBanner>
                      <RegisterForm
                        onShowRegister={setShowregister}
                        onSuccess={() => setShow(false)}
                        onShow={setCloseModal}
                      />
                    </ContentWrapper>
                  ) : (
                    <ContentWrapper>
                      <PageBanner>
                        <BannerHeader>
                          <div>บริการยืมหนังสือ</div>
                          <span>
                            และบริจาคหนังสือเพื่อร่วมกันสร้างสังคมแห่งการแบ่งปัน
                          </span>
                        </BannerHeader>
                        <BannerImage>
                          <Image
                            alt="login-banner"
                            src={LoginBanner}
                            layout="fill"
                            objectFit="contain"
                          />
                        </BannerImage>
                      </PageBanner>
                      <LoginForm
                        onShowRegister={setShowregister}
                        onSuccess={() => setShow(false)}
                        onShow={setCloseModal}
                      />
                    </ContentWrapper>
                  )}
                </ModalContainer>
              </ResponsiveModal>
            ) : (
              ''
            )
          )}
        </ModalBackground>
      )}
    </>
  )
}

export default AuthModal
