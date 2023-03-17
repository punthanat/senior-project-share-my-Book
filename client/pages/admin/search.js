import {useState, useEffect} from 'react'
import styled from 'styled-components'
import {SPACING} from '../../styles/spacing'
import Pagination from '../../components/Pagination'
import {COLORS} from '../../styles/colors'
import IconButton from '../../components/IconButton'
import {ICONS} from '../../config/icon'
import {useRouter} from 'next/router'
import shelfService from '../../api/request/shelfService'
import Head from 'next/head'
import {default_param} from '../../config/searchQuery'
import Image from 'next/image'
import AdminLayout from '../../components/layouts/AdminLayout'
import SearchBookInput from '../../components/SearchBookInput'
import {AdminTitle} from '../../components/Admin'

const ImgContainer = styled.div`
  position: relative;
  width: 100px;
  height: 120px;
`

const PaginationWrapper = styled.div`
  border-radius: 28px;
  margin: ${SPACING.MD} 0;
  padding: ${SPACING.MD};
  display: flex;
  justify-content: center;
`

const NoResult = styled.div`
  height: 200px;
  width: 100%;
  line-height: 200px;
  text-align: center;
  font-size: 24px;
  background-color: ${COLORS.GRAY_LIGHT_2};
  border-radius: ${SPACING.MD};
`

const Table = styled.table`
  width: 100%;
`

const Thead = styled.thead`
  background-color: ${COLORS.GRAY_LIGHT_2};

  > tr > td {
    border: none;
  }
`

const Td = styled.td`
  padding: ${SPACING.MD};
  border-style: solid;
  border-color: ${COLORS.GRAY_LIGHT};
  max-width: 250px;
  font-size: 14px;
`

const Tbody = styled.tbody`
  > tr:not(:last-child) > td {
    border-width: 0 0 1px;
  }
`

const AdminSearchPage = ({isEmptyQuery, bookData, total, pageSize}) => {
  const router = useRouter()
  const pathname = '/admin/search'

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
      router.push({
        pathname,
        query: default_param,
      })
    }
  }, [isEmptyQuery, router])

  return (
    <>
      <Head>
        <title>ADMIN - ค้นหาหนังสือ</title>
      </Head>
      <AdminTitle>ค้นหาหนังสือ</AdminTitle>

      <SearchBookInput baseSearchPath={pathname} />

      <Table>
        <Thead>
          <tr>
            <Td>หน้าปก</Td>
            <Td>ISBN</Td>
            <Td>ชื่อหนังสือ</Td>
            <Td>ผู้แต่ง</Td>
            <Td>ประเภท</Td>
            <Td>จำนวนที่ว่างให้ยืม / เล่ม</Td>
            <Td>จำนวนทั้งหมดในระบบ / เล่ม</Td>
            <Td>ยอดการยืม / ครั้ง</Td>
            <Td></Td>
          </tr>
        </Thead>
        {bookData?.length > 0 && (
          <Tbody>
            {bookData.map((book) => (
              <tr key={book._id}>
                <Td>
                  <ImgContainer>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${book.imageCover}`}
                      alt={book.bookName}
                      layout="fill"
                      objectFit="contain"
                    />
                  </ImgContainer>
                </Td>
                <Td>{book.ISBN}</Td>
                <Td>{book.bookName}</Td>
                <Td>{book.author}</Td>
                <Td>{book?.types?.map((type) => type?.typeName + ', ')}</Td>
                <Td>{book.totalAvailable}</Td>
                <Td>{book.totalQuantity}</Td>
                <Td>{book.totalBorrow}</Td>
                <Td>
                  <IconButton
                    iconSize="lg"
                    name={ICONS.faPenToSquare}
                    padding="8px"
                    onClick={() => router.push(`/admin/editbook/${book.ISBN}`)}
                  ></IconButton>
                </Td>
              </tr>
            ))}
          </Tbody>
        )}
      </Table>

      {(!bookData || bookData?.length === 0) && (
        <NoResult>ขออภัย ไม่พบข้อมูลการค้นหานี้</NoResult>
      )}

      {Math.ceil(total / pageSize) > 1 && (
        <PaginationWrapper>
          <Pagination
            totalPage={Math.ceil(total / pageSize)}
            currentPage={+router.query.page}
            onPageChange={onPageChange}
          />
        </PaginationWrapper>
      )}
    </>
  )
}

export default AdminSearchPage

AdminSearchPage.Layout = AdminLayout

export const getServerSideProps = async (context) => {
  const pageSize = 5
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
      bookData,
      total,
      pageSize,
    },
  }
}
