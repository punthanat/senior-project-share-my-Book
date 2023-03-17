import React, {useState} from 'react'
import useAddPublisher from '../../api/query/useAddPublisher'
import {AdminTitle} from '../../components/Admin'
import Button from '../../components/Button'
import InputWithIcon from '../../components/forms/InputWithIcon'
import AdminLayout from '../../components/layouts/AdminLayout'
import {ICONS} from '../../config/icon'
import styled from 'styled-components'
import {COLORS} from '../../styles/colors'
import {SPACING} from '../../styles/spacing'
import Head from 'next/head'
import Pagination from '../../components/Pagination'
import usePublishers from '../../api/query/usePublishers'
import {useRouter} from 'next/router'

const InputWrapper = styled.div`
  max-width: 500px;
  background-color: ${COLORS.PURPLE_2};
  padding: ${SPACING.LG};
  border-radius: ${SPACING.MD};
  display: flex;
  flex-direction: column;
  gap: ${SPACING.MD};
  align-items: start;
`

const Table = styled.table`
  width: 100%;
  border: 1px solid ${COLORS.GRAY_LIGHT};
  border-radius: ${SPACING.MD};
  overflow: hidden;
  margin: ${SPACING.LG} 0;
`

const Thead = styled.thead`
  > tr > td {
    padding: ${SPACING.MD};
    border: 1px solid ${COLORS.GRAY_LIGHT};
    border-width: 0 0 1px 0;
    background-color: ${COLORS.GRAY_LIGHT_2};
    font-weight: 600;
  }
`

const Tbody = styled.tbody`
  > tr {
    > td {
      padding: ${SPACING.SM};
      border: 1px solid ${COLORS.GRAY_LIGHT};
      border-width: 0 0 1px 0;
      word-break: break-all;
    }

    &:last-of-type > td {
      border: none;
    }
  }
`

const PaginationWrapper = styled.div`
  border-radius: 28px;
  margin: ${SPACING.MD} auto;
  padding: ${SPACING.MD};
  width: 100%;
  display: flex;
  justify-content: center;
`

const PublisherPage = ({currentPage}) => {
  const [inputPublisher, setInputPublisher] = useState('')
  const {mutate: addPublisher} = useAddPublisher()
  const {data: publishers} = usePublishers()
  const pageSize = 10
  const router = useRouter()

  const validate = () => {
    if (inputPublisher.length < 1) {
      return 0
    }
    return 1
  }

  const submitPublisher = () => {
    if (validate) {
      addPublisher(inputPublisher)
      return setInputPublisher('')
    }
  }

  const onPageChange = (page) => {
    router.push({pathname: '/admin/publishers', query: {page}})
  }

  return (
    <>
      <Head>
        <title>ADMIN - จัดการข้อมูลของสำนักพิมพ์</title>
      </Head>
      <div>
        <AdminTitle>จัดการข้อมูลของสำนักพิมพ์</AdminTitle>
        <InputWrapper>
          <InputWithIcon
            label="ชื่อสำนักพิมพ์"
            placeholder="กรอกชื่อสำนักพิมพ์"
            onChange={setInputPublisher}
            iconName={ICONS.faBook}
            value={inputPublisher}
          ></InputWithIcon>

          <Button
            btnType="orangeGradient"
            onClick={submitPublisher}
            btnSize="sm"
          >
            เพิ่มสำนักพิมพ์ใหม่
          </Button>
        </InputWrapper>

        <Table>
          <Thead>
            <tr>
              <td>ID</td>
              <td>ชื่อสำนักพิมพ์</td>
              <td></td>
            </tr>
          </Thead>

          <Tbody>
            {publishers
              ?.slice(
                (currentPage - 1) * pageSize,
                (currentPage - 1) * pageSize + pageSize
              )
              ?.map((publisher) => (
                <tr key={publisher.id}>
                  <td>{publisher.id}</td>
                  <td>{publisher.name}</td>
                  <td></td>
                </tr>
              ))}
          </Tbody>
        </Table>

        {Math.ceil(publishers?.length / pageSize) > 1 && (
          <PaginationWrapper>
            <Pagination
              totalPage={Math.ceil(publishers.length / pageSize)}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </PaginationWrapper>
        )}
      </div>
    </>
  )
}

export default PublisherPage
PublisherPage.Layout = AdminLayout

export const getServerSideProps = (context) => {
  return {
    props: {
      currentPage: context.query.page ? +context.query.page : 1,
    },
  }
}
