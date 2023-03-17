import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {useState} from 'react'
import styled from 'styled-components'
import adminService from '../../../api/request/adminService'
import {Button} from '../../../components'
import {AdminTitle} from '../../../components/Admin'
import Input from '../../../components/forms/Input'
import AdminLayout from '../../../components/layouts/AdminLayout'
import Pagination from '../../../components/Pagination'
import {reportTypes} from '../../../config/reportType'
import {default_report_param} from '../../../config/searchQuery'
import {COLORS} from '../../../styles/colors'
import {FONTS} from '../../../styles/fonts'
import {SPACING} from '../../../styles/spacing'
import {formatDate} from '../../../utils/format'

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
  word-break: break-all;
`

const Tbody = styled.tbody`
  > tr:not(:last-child) > td {
    border-width: 0 0 1px;
  }
`

const SelectWrapper = styled.div`
  display: flex;
  gap: ${SPACING['2X']};
  margin: ${SPACING['2X']} 0;
`

const SelectLabel = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 18px;

  > select {
    font-family: ${FONTS.SARABUN};
  }
`

const PaginationWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: ${SPACING['2X']} 0;
`

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 250px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  background-color: ${COLORS.GRAY_LIGHT};
  border-radius: ${SPACING.MD};
`

const ReportPage = ({isEmptyQuery}) => {
  const [reportList, setReportList] = useState([])
  const [total, setTotal] = useState(0)
  const pageSize = 10
  const router = useRouter()
  const pathname = '/admin/report'

  useEffect(() => {
    if (isEmptyQuery) {
      router.push({
        pathname,
        query: default_report_param,
      })
    }
  }, [isEmptyQuery, router])

  useEffect(() => {
    adminService
      .searchReport({...router.query}, pageSize)
      .then((res) => {
        setTotal(res?.data?.total)
        setReportList(res?.data?.data)
      })
      .catch((err) => {
        return err
      })
  }, [router.query])

  const handleQuery = (key, e) => {
    if (e.target.value === 'all') {
      let routerQuery = router.query
      delete routerQuery[key]

      return router.push({
        pathname,
        query: {...routerQuery, page: 1},
      })
    }

    router.push({
      pathname,
      query: {...router.query, [key]: e.target.value, page: 1},
    })
  }

  const pageHandler = (page) => {
    router.push({
      pathname,
      query: {...router.query, page},
    })
  }

  return (
    <div>
      <AdminTitle>การรายงานทั้งหมด (พบทั้งหมด {total} รายงาน)</AdminTitle>

      <SelectWrapper>
        <SelectLabel htmlFor="type-report">
          ประเภทการรายงาน
          <select id="type-report" onChange={(e) => handleQuery('idType', e)}>
            <option value="all">ทั้งหมด</option>
            {Object.keys(reportTypes).map((type) => (
              <option
                value={type}
                defaultValue={router.query.idType === type}
                key={type}
              >
                {reportTypes[type]}
              </option>
            ))}
          </select>
        </SelectLabel>

        <SelectLabel htmlFor="status-report">
          สถานะการรายงาน
          <select id="status-report" onChange={(e) => handleQuery('status', e)}>
            <option value="all">ทั้งหมด</option>
            <option
              value="waiting"
              defaultValue={router.query.status === 'waiting'}
            >
              ยังไม่ถูกรับเรื่อง
            </option>
            <option
              value="inProcess"
              defaultValue={router.query.status === 'inProcess'}
            >
              กำลังดำเนินการ
            </option>
            <option
              value="success"
              defaultValue={router.query.status === 'success'}
            >
              สำเร็จแล้ว
            </option>
            <option
              value="reject"
              defaultValue={router.query.status === 'reject'}
            >
              ถูกยกเลิก
            </option>
            <option
              value="waitHolderResponse"
              defaultValue={router.query.status === 'waitHolderResponse'}
            >
              รอผู้ใช้ติดต่อกลับ
            </option>
          </select>
        </SelectLabel>

        <SelectLabel htmlFor="owner-report">
          ผู้รับเรื่องรายงาน
          <select
            id="owner-report"
            onChange={(e) => handleQuery('isHandleReport', e)}
          >
            <option
              value="false"
              defaultValue={router.query.isHandleReport === 'false'}
            >
              ทั้งหมด
            </option>
            <option
              value="true"
              defaultValue={router.query.isHandleReport === 'true'}
            >
              รายงานที่ฉันรับเรื่อง
            </option>
          </select>
        </SelectLabel>
      </SelectWrapper>

      {total > 0 ? (
        <Table>
          <Thead>
            <tr>
              <th>หัวข้อ</th>
              <th>วันที่รายงาน</th>
              <th>รายละเอียด</th>
              <th>สถานะ</th>
              <th>ผู้ส่งรายงาน</th>
              <th></th>
            </tr>
          </Thead>
          <Tbody>
            {reportList?.map((row) => (
              <tr key={row?._id}>
                <Td>{reportTypes[row?.idType]}</Td>
                <Td>{formatDate(row?.reportTime, true, true, true)}</Td>
                <Td>{row?.message}</Td>
                <Td>{row?.status}</Td>
                <Td>{row?.userWhoReport}</Td>
                <Td>
                  <Button
                    btnSize="sm"
                    onClick={() => router.push(`report/${row._id}`)}
                  >
                    รายละเอียด
                  </Button>
                </Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <EmptyState>ไม่มีผลลัพธ์ของการค้นหานี้</EmptyState>
      )}

      {Math.ceil(total / pageSize) > 0 && (
        <PaginationWrapper>
          <Pagination
            onPageChange={pageHandler}
            currentPage={+router.query.page}
            totalPage={Math.ceil(total / pageSize)}
          />
        </PaginationWrapper>
      )}
    </div>
  )
}

export default ReportPage
ReportPage.Layout = AdminLayout

export const getServerSideProps = (context) => {
  return {
    props: {
      isEmptyQuery: Object.keys(context.query).length < 1 ? true : false,
    },
  }
}
