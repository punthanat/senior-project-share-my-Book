import {useState, useEffect} from 'react'
import BookCard from '../components/BookCard'
import styled from 'styled-components'
import {SPACING} from '../styles/spacing'
import Pagination from '../components/Pagination'
import Background from '../public/static/images/background-default.png'
import {COLORS} from '../styles/colors'
import {Icon} from '../components'
import {FONTS} from '../styles/fonts'
import BackgroundContainer from '../components/BackgroundContainer'
import {ICONS, ICON_SIZE} from '../config/icon'
import {useRouter} from 'next/router'
import shelfService from '../api/request/shelfService'
import Head from 'next/head'
import {default_param} from '../config/searchQuery'
import {BoxLayout, ContentWrapper} from '../components/Layout'
import {animated, useTransition} from 'react-spring'
import AnimatedNumber from '../components/springs/AnimatedNumber'
import SearchBookInput from '../components/SearchBookInput'

const BookListContainer = styled.section`
  margin: ${SPACING.LG} 0;
  max-width: 100%;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${SPACING.LG};

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const PaginationWrapper = styled.div`
  border-radius: 28px;
  margin: ${SPACING.MD} 0;
  padding: ${SPACING.MD};
`

const BreadCrumb = styled.ul`
  display: flex;
  align-self: start;
  align-items: center;
  font-size: 14px;
  gap: ${SPACING.MD};
`

const BreadCrumbLink = styled.li`
  &:hover {
    transition: 0.1s;
    cursor: pointer;
    text-decoration: underline;
  }
`

const NoResult = styled.div`
  height: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 24px;
  background-color: ${COLORS.GRAY_LIGHT_2};
  border-radius: ${SPACING.MD};
  margin-top: ${SPACING.LG};
`

const ResultCount = styled.div`
  text-align: left;
  align-self: end;
  margin: 0 ${SPACING['2X']};
  color: ${COLORS.GRAY_DARK};
  font-family: ${FONTS.SARABUN};
  font-size: 14px;
`

const SearchPage = ({isEmptyQuery, total, bookData, pageSize}) => {
  const router = useRouter()
  const pathname = '/search'
  const bookTransition = useTransition(bookData, {
    from: {opacity: 0, y: 100},
    enter: {opacity: 1, y: 0},
    trail: 100,
  })

  const onPageChange = (page) => {
    router.push({
      pathname,
      query: {...router.query, page},
    })
  }

  useEffect(() => {
    if (isNaN(+router.query.page) || +router.query.page < 1) {
      return router.replace({
        pathname,
        query: {
          ...router.query,
          page: 1,
        },
      })
    }
  }, [router])

  useEffect(() => {
    if (isEmptyQuery) {
      router.push({pathname, query: default_param})
    }
  }, [isEmptyQuery, router])

  return (
    <>
      <Head>
        <title>Share my Book - ค้นหาหนังสือ</title>
      </Head>
      <BackgroundContainer link={Background.src}>
        <BoxLayout>
          <ContentWrapper margin="16px 0" width="max-content">
            <BreadCrumb>
              <BreadCrumbLink onClick={() => router.push('/')}>
                หน้าแรก
              </BreadCrumbLink>
              <Icon name={ICONS.faChevronRight} size={ICON_SIZE.sm} />
              <li>ค้นหาหนังสือ</li>
            </BreadCrumb>
          </ContentWrapper>

          <ContentWrapper margin="0 auto 30px">
            <SearchBookInput baseSearchPath={pathname} />

            <ResultCount>
              พบหนังสือ <AnimatedNumber maxNumber={total} /> เล่ม
            </ResultCount>

            {bookData?.length > 0 && (
              <BookListContainer>
                {bookTransition((props, item) => (
                  <animated.div key={`book-${item._id}`} style={props}>
                    <BookCard bookInfo={item} />
                  </animated.div>
                ))}
              </BookListContainer>
            )}
            {(!bookData || bookData?.length === 0) && (
              <NoResult>ไม่พบข้อมูลการค้นหานี้</NoResult>
            )}

            {Math.ceil(total / pageSize) > 1 && (
              <PaginationWrapper>
                <Pagination
                  totalPage={Math.ceil(total / pageSize)}
                  currentPage={+router.query?.page}
                  onPageChange={onPageChange}
                />
              </PaginationWrapper>
            )}
          </ContentWrapper>
        </BoxLayout>
      </BackgroundContainer>
    </>
  )
}

export default SearchPage

export const getServerSideProps = async (context) => {
  const pageSize = 9
  let total = 0
  let bookData = []

  await shelfService
    .searchBookShelf(context.query, pageSize)
    .then((res) => {
      total = res.total ?? 0
      bookData = res.data ?? []
    })
    .catch(() => {
      return
    })
  return {
    props: {
      isEmptyQuery: Object.keys(context.query).length < 1 ? true : false,
      total,
      bookData,
      pageSize,
    },
  }
}
