import Head from 'next/head'
import BookCard from '../components/BookCard'
import styled from 'styled-components'
import {SPACING} from '../styles/spacing'
import Background from '../public/static/images/background-default.png'
import {COLORS} from '../styles/colors'
import {Divider, Icon} from '../components'
import {FONTS} from '../styles/fonts'
import BackgroundContainer from '../components/BackgroundContainer'
import {ICONS} from '../config/icon'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Scrollbar} from 'swiper'
import 'swiper/css'
import 'swiper/css/scrollbar'
import {css} from 'styled-components'
import {useRouter} from 'next/router'
import shelfService from '../api/request/shelfService'
import {default_param} from '../config/searchQuery'
import {ContentWrapper} from '../components/Layout'
import Reading from '../public/static/images/student-reading.png'
import Image from 'next/image'
import Trail from '../components/springs/Trail'
import Fade from '../components/springs/Fade'
import {useSpring, animated} from 'react-spring'

const BookListContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.LG};
  margin: 30px 0 16px;
  justify-content: center;
  max-width: 100%;
  height: 100%;
  width: 100%;
`

const BannerWrapper = styled.section`
  display: flex;
  width: 100%;
  padding: ${SPACING.LG};
  gap: ${SPACING['2X']};
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const AppDescribe = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.LG};
`

const AppName = styled.h1`
  font-size: 32px;
  font-weight: 600;
  font-family: ${FONTS.SARABUN};
  color: ${COLORS.PRIMARY};

  @media (min-width: 768px) {
    font-size: 38px;
  }
`

const AppHeader = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: ${COLORS.PRIMARY};

  @media (min-width: 768px) {
    font-size: 28px;
  }
`

const ImageContainer = styled.div`
  max-width: 600px;
  width: 100%;
  position: relative;
`

const Description = styled.p`
  line-height: 1.75em;
  letter-spacing: 0.025em;
`

const SearchButton = styled.button`
  @keyframes Gradient {
    50% {
      background-position: 140% 50%;
      transform: skew(-2deg);
    }
  }

  position: relative;
  background: linear-gradient(-45deg, #f4ed3c, #ef435a, #114273, #66c1ed);
  background-size: 400% 100%;
  text-transform: uppercase;
  font-weight: 700;
  border: none;
  border-radius: ${SPACING.MD};
  padding: ${SPACING.SM};
  font-family: ${FONTS.PRIMARY};
  align-self: start;
  width: 100%;
  color: ${COLORS.WHITE};
  display: flex;
  justify-content: center;
  align-items: center;

  > * {
    z-index: 1;
  }

  > div {
    padding: 0 ${SPACING.MD};
    border-radius: inherit;
    position: relative;
    font-size: 20px;
    font-weight: 600;
  }

  &:hover {
    animation: Gradient 3s ease infinite;

    &:after {
      content: '';
      position: absolute;
      background-size: inherit;
      background-image: inherit;
      animation: inherit;
      left: 0px;
      right: 0px;
      top: 2px;
      height: 100%;
      filter: blur(1rem);
    }
  }
`

const SecondaryRecommendStyled = css`
  background-color: ${COLORS.PRIMARY};
  color: ${COLORS.GRAY_LIGHT_2};
`

const RecommendWrapper = styled.section`
  width: 100%;
  padding: ${SPACING.MD};
  background-color: ${COLORS.GRAY_LIGHT_2};
  border-radius: ${SPACING.MD};
  color: ${COLORS.PRIMARY};

  ${(props) => props.type === 'secondary' && SecondaryRecommendStyled}
`

const Title = styled(animated.h3)`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: ${SPACING.SM};

  > svg {
    margin-left: ${SPACING.SM};
  }
`

const Home = ({newBook, recommendBook}) => {
  const router = useRouter()
  const headerTransition = useSpring({
    from: {x: 500},
    to: {x: 0},
  })

  const handleClickSearch = () => {
    router.push({pathname: '/search', query: default_param})
  }

  return (
    <>
      <Head>
        <title>Share my Book</title>
        <meta
          name="description"
          content="INT365/371 Share my Book Application"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BackgroundContainer link={Background.src}>
        <ContentWrapper>
          <BannerWrapper>
            <ImageContainer>
              <Fade>
                <Image
                  src={Reading.src}
                  alt="reading banner"
                  width={600}
                  height={600}
                  layout="responsive"
                  priority
                />
              </Fade>
            </ImageContainer>

            <AppDescribe>
              <Trail open={true}>
                <AppName>Share My Book</AppName>
                <Divider lineColor={COLORS.PRIMARY}></Divider>
                <span>แอปพลิเคชันส่งต่อหนังสือ </span>
              </Trail>

              <Trail open={true}>
                <AppHeader>เป็นแอปพลิเคชันไว้ทำอะไรล่ะ?</AppHeader>
                <Description>
                  &nbsp;&nbsp; &nbsp;&nbsp;
                  &nbsp;&nbsp;เป็นแอปพลิเคชันที่มีบริการให้คุณสามารถยืมหนังสือในระบบ
                  ซึ่งหนังสือในระบบนั้นก็มาจากผู้ที่สนใจที่จะบริจาคหนังสือที่ตนเองไม่ต้องการจะเก็บสะสมไว้
                  และด้วยความที่เป็นระบบยืมหนังสือ
                  ระบบของเราจึงเหมือนเป็นชั้นหนังสือกลางที่ไม่ว่าใครก็สามารถมาขอยืมหนังสือกับเราได้
                  หากเวลาที่คุณยืมหมดลงคุณก็จะต้องส่งหนังสือที่คุณยืมไปให้คนที่มาขอยืมต่อ
                  เพื่อเป็นการส่งต่อหนังสือต่อไป
                  ทำให้หนังสือที่เราได้รับบริจาคยังวนเวียนอยู่ในระบบและทำให้หนังสือเหล่านั้นได้มอบความรู้และความบันเทิงให้กับผู้อืนต่อไป
                </Description>
              </Trail>

              <SearchButton onClick={handleClickSearch}>
                <Icon name={ICONS.faSearch} size="lg" />
                <div>ค้นหาหนังสือที่คุณสนใจ</div>
              </SearchButton>
            </AppDescribe>
          </BannerWrapper>

          <BookListContainer>
            <RecommendWrapper>
              <Title style={headerTransition}>
                หนังสือยอดนิยมที่สุด <Icon name={ICONS.faFire} />
              </Title>

              <Fade>
                <Swiper
                  slidesPerView={1}
                  spaceBetween={10}
                  breakpoints={{
                    700: {
                      slidesPerView: 2,
                      spaceBetween: 40,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 50,
                    },
                  }}
                  scrollbar={{
                    hide: true,
                  }}
                  modules={[Scrollbar]}
                  className="mySwiper"
                >
                  {recommendBook?.map((book) => (
                    <SwiperSlide key={`recommendBook-${book._id}`}>
                      <BookCard bookInfo={book} isCarousel></BookCard>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Fade>
            </RecommendWrapper>

            <RecommendWrapper>
              <Title style={headerTransition}>
                หนังสือมาใหม่ <Icon name={ICONS.faCalendarDays} />
              </Title>
              <Fade>
                <Swiper
                  slidesPerView={1}
                  spaceBetween={10}
                  breakpoints={{
                    700: {
                      slidesPerView: 2,
                      spaceBetween: 40,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 50,
                    },
                  }}
                  scrollbar={{
                    hide: true,
                  }}
                  modules={[Scrollbar]}
                  className="mySwiper"
                >
                  {newBook?.map((book) => (
                    <SwiperSlide key={`newBook-${book._id}`}>
                      <BookCard bookInfo={book} isCarousel></BookCard>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Fade>
            </RecommendWrapper>
          </BookListContainer>
        </ContentWrapper>
      </BackgroundContainer>
    </>
  )
}

export async function getStaticProps() {
  let newBook = []
  let recommendBook = []

  await shelfService
    .searchBookShelf(
      {
        sortBy: 'totalBorrow',
        isDescending: 'yes',
      },
      5
    )
    .then((res) => (recommendBook = res.data))
    .catch(() => {
      return
    })

  await shelfService
    .searchBookShelf({sortBy: '_id', isDescending: 'yes'}, 5)
    .then((res) => (newBook = res.data))
    .catch(() => {
      return
    })

  return {
    props: {newBook, recommendBook},
    revalidate: 10,
  }
}

export default Home
