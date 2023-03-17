import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import {useState} from 'react'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import useBorrowHistory from '../../api/query/useBorrowHistory'
import ProfileLayout from '../../components/layouts/ProfileLayout'
import Pagination from '../../components/Pagination'
import {years} from '../../config/years'
import useAddressInfo from '../../hooks/useAddressInfo'
import {COLORS} from '../../styles/colors'
import {FONTS} from '../../styles/fonts'
import {SPACING} from '../../styles/spacing'
import {formatDate, thaiMonths} from '../../utils/format'

const TitleWrapper = styled.div`
  width: 100%;
  margin: ${SPACING.MD};
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: start;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
`

const Select = styled.select`
  padding: ${SPACING.XS};
  font-family: ${FONTS.SARABUN};
`

const HeadWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${SPACING.SM};
  padding: 0 ${SPACING.MD};
  font-size: 14px;
  font-family: ${FONTS.SARABUN};
`

const Table = styled.table`
  width: 100%;
  border: 1px solid ${COLORS.GRAY_LIGHT};
  border-radius: ${SPACING.MD};
  overflow: hidden;
  margin: ${SPACING.LG} 0;
  display: table;
`

const Thead = styled.thead`
  display: none;

  @media (min-width: 800px) {
    display: table-header-group;
  }

  > tr {
    > td {
      width: 220px;
      padding: ${SPACING.MD};
      border: 1px solid ${COLORS.GRAY_LIGHT};
      border-width: 0 0 1px;
      background-color: ${COLORS.GRAY_LIGHT_2};
      font-weight: 600;
    }

    > td:first-of-type {
      width: 120px;
    }
  }
`

const Tbody = styled.tbody`
  > tr {
    padding: ${SPACING.SM} 0;
    letter-spacing: 0.025em;
    display: flex;
    flex-direction: column;
    border: 1px solid ${COLORS.GRAY_LIGHT};
    border-width: 0 0 1px;

    > td {
      padding: ${SPACING.SM};
      border: none;
      margin: 0 auto;
      display: flex;
      width: 100%;
      justify-content: space-between;

      @media (min-width: 800px) {
        display: table-cell;
        width: initial;
        border: 1px solid ${COLORS.GRAY_LIGHT};
        border-width: 0 0 1px;
      }

      > span:first-child {
        width: 50%;
        display: block;

        @media (min-width: 800px) {
          display: none;
        }
      }

      > span:last-child {
        width: 50%;
      }
    }

    @media (min-width: 800px) {
      display: table-row;
    }

    &:last-of-type {
      border: none;

      > td {
        border: none;
      }
    }
  }
`

const Td = styled.td`
  word-break: break-all;
`

const PaginationWrapper = styled.div`
  border-radius: 28px;
  margin: 0 auto;
  padding: ${SPACING.MD};
  display: flex;
  justify-content: center;
`

const EmptyRow = styled.td`
  padding: ${SPACING['5X']} 0;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
`

const ContentWrapper = styled.div``

const BorrowHistoryPage = () => {
  const user = useSelector((state) => state.user.user)
  const isAddressTel = useAddressInfo()
  const [filterMonth, setFilterMonth] = useState('all')
  const [filterYear, setFilterYear] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const {data} = useBorrowHistory(isAddressTel)
  const pageSize = 10

  const filterLogic = (item) => {
    const receiveDate = new Date(item.receiveTime)
    return (
      (receiveDate.getMonth() === +filterMonth || isNaN(+filterMonth)) &&
      (receiveDate.getFullYear() === +filterYear || isNaN(+filterYear)) &&
      item
    )
  }

  const filterList = () => {
    return data?.data?.data?.filter((item) => {
      return filterLogic(item)
    })
  }

  const onPageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <Head>
        <title>ประวัติการยืมของคุณ</title>
      </Head>
      <TitleWrapper>
        <Title>ประวัติการยืมของคุณ</Title>
      </TitleWrapper>
      <HeadWrapper>
        <span>เดือนที่ยืม</span>
        <Select
          onChange={(e) => {
            setCurrentPage(1)
            setFilterMonth(e.target.value)
          }}
        >
          <option value="all" defaultValue>
            ทั้งหมด
          </option>
          {thaiMonths['full'].map((month, index) => (
            <option value={index} key={`month-${index}`}>
              {month}
            </option>
          ))}
        </Select>
        <span>ปี</span>
        <Select
          onChange={(e) => {
            setCurrentPage(1)
            setFilterYear(e.target.value)
          }}
        >
          <option value="all" defaultValue>
            ทั้งหมด
          </option>
          {years.map((year, index) => (
            <option value={year} key={`year-${index}`}>
              {year}
            </option>
          ))}
        </Select>
      </HeadWrapper>
      <ContentWrapper>
        <Table>
          <Thead>
            <tr>
              <Td>ภาพหน้าปก</Td>
              <Td>ISBN</Td>
              <Td>ชื่อหนังสือ</Td>
              <Td>วันที่ได้รับ</Td>
              <Td>วันหมดอายุ</Td>
            </tr>
          </Thead>

          {filterList() &&
          filterList().slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          ).length > 0 ? (
            <Tbody>
              {filterList()
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                ?.map((row, i) => (
                  <tr key={`row${i}`}>
                    <Td>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${row?.book?.bookShelf?.imageCover}`}
                        alt={row.bookName}
                        width={80}
                        height={100}
                        objectFit="contain"
                      />
                    </Td>
                    <Td>
                      <span>ISBN</span>
                      <span>{row?.book?.bookShelf?.ISBN}</span>
                    </Td>
                    <Td>
                      <span>ชื่อหนังสือ</span>
                      <span>{row?.book?.bookShelf?.bookName}</span>
                    </Td>
                    <Td>
                      <span>วันที่ได้รับ</span>
                      <span>
                        {formatDate(row?.receiveTime, true, true, true)}{' '}
                      </span>
                    </Td>
                    <Td>
                      <span>วันหมดอายุ</span>
                      <span>
                        {formatDate(row?.expireTime, true, true, true)}{' '}
                      </span>
                    </Td>
                  </tr>
                ))}
            </Tbody>
          ) : (
            <tbody>
              <tr>
                <EmptyRow colSpan="5">ไม่พบประวัติการยืม</EmptyRow>
              </tr>
            </tbody>
          )}
        </Table>

        {filterList() && Math.ceil(filterList().length / pageSize) > 1 && (
          <PaginationWrapper>
            <Pagination
              totalPage={Math.ceil(filterList().length / pageSize)}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </PaginationWrapper>
        )}
      </ContentWrapper>
    </>
  )
}

BorrowHistoryPage.Layout = ProfileLayout

export default BorrowHistoryPage
