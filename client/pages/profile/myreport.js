import React, {useEffect, useState} from 'react'
import ProfileLayout from '../../components/layouts/ProfileLayout'
import styled from 'styled-components'
import Head from 'next/head'
import {SPACING} from '../../styles/spacing'
import useMyNotification from '../../api/query/useMyNotification'
import {formatDate, thaiMonths} from '../../utils/format'
import {COLORS} from '../../styles/colors'
import {FONTS} from '../../styles/fonts'
import {years} from '../../config/years'
import Pagination from '../../components/Pagination'
import useSeenNotification from '../../api/query/useSeenNotification'
import {useSelector} from 'react-redux'
import useMyReport from '../../api/query/useMyReport'
import {reportTypes} from '../../config/reportType'
import {Icon} from '../../components'
import {ICONS} from '../../config/icon'

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
      max-width: 300px;
      padding: ${SPACING.MD};
      border: 1px solid ${COLORS.GRAY_LIGHT};
      border-width: 0 0 1px;
      background-color: ${COLORS.GRAY_LIGHT_2};
      font-weight: 600;
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
      max-width: 300px;
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

      &:last-of-type {
        text-align: center;
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

const ReceiveReport = styled.div`
  color: ${(props) => (!props.unReceive ? COLORS.GREEN_1 : COLORS.RED_2)};
`

const MyReportPage = () => {
  const isAuth = useSelector((state) => state.user.isAuth)
  const {data: myReport} = useMyReport(isAuth)
  const [filterMonth, setFilterMonth] = useState('all')
  const [filterYear, setFilterYear] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const filterLogic = (item) => {
    const receiveDate = new Date(item.reportTime)
    return (
      (receiveDate.getMonth() === +filterMonth || isNaN(+filterMonth)) &&
      (receiveDate.getFullYear() === +filterYear || isNaN(+filterYear)) &&
      item
    )
  }

  const filterList = () => {
    return myReport?.data?.data?.filter((item) => {
      return filterLogic(item)
    })
  }

  const onPageChange = (page) => {
    setCurrentPage(page)
  }

  console.log(myReport?.data)

  return (
    <>
      <Head>
        <title>Share my Book - การรายงานของฉัน</title>
      </Head>
      <TitleWrapper>
        <Title>การรายงานของฉัน</Title>
      </TitleWrapper>
      <HeadWrapper>
        <span>เดือน</span>
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
      <Table>
        <Thead>
          <tr>
            <Td>หัวข้อ</Td>
            <Td>รายละเอียด</Td>
            <Td>วันที่รายงาน</Td>
            <Td>สถานะ</Td>
            <Td>การรับเรื่อง</Td>
          </tr>
        </Thead>
        {filterList() &&
        filterList().slice((currentPage - 1) * pageSize, currentPage * pageSize)
          .length > 0 ? (
          <Tbody>
            {filterList()
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              ?.map((item) => (
                <tr key={item?._id}>
                  <Td>{reportTypes[item?.idType]}</Td>
                  <Td>{item?.message}</Td>
                  <Td>{formatDate(item?.reportTime, true, true, true)}</Td>
                  <Td>{item?.status}</Td>

                  <Td>
                    {!item?.adminWhoManage ? (
                      <ReceiveReport unReceive={true}>
                        {' '}
                        <Icon name={ICONS.faCircleXmark} />
                      </ReceiveReport>
                    ) : (
                      <ReceiveReport>
                        <Icon name={ICONS.faCircleCheck} />
                      </ReceiveReport>
                    )}
                  </Td>
                </tr>
              ))}
          </Tbody>
        ) : (
          <tbody>
            <tr>
              <EmptyRow colSpan="5">ไม่พบข้อมูล</EmptyRow>
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
    </>
  )
}

MyReportPage.Layout = ProfileLayout

export default MyReportPage
