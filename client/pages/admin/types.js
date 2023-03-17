import React, {useState} from 'react'
import {AdminTitle} from '../../components/Admin'
import InputWithIcon from '../../components/forms/InputWithIcon'
import AdminLayout from '../../components/layouts/AdminLayout'
import {COLORS} from '../../styles/colors'
import styled from 'styled-components'
import {SPACING} from '../../styles/spacing'
import Button from '../../components/Button'
import useAddType from '../../api/query/useAddType'
import {ICONS} from '../../config/icon'
import Head from 'next/head'
import useTypes from '../../api/query/useTypes'
import Pagination from '../../components/Pagination'
import {useRouter} from 'next/router'
import {QueryClient} from 'react-query'

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

const TypePage = ({currentPage}) => {
  const [inputType, setInputType] = useState('')
  const {mutate: addType} = useAddType()
  const {data: types} = useTypes()
  const pageSize = 10
  const router = useRouter()

  const validate = () => {
    if (inputType.length < 1) {
      return 0
    }
    return 1
  }

  const submitType = async () => {
    if (validate) {
      addType(inputType)
      return setInputType('')
    }
  }

  const onPageChange = (page) => {
    router.push({pathname: '/admin/types', query: {page}})
  }

  return (
    <>
      <Head>
        <title>ADMIN - จัดการข้อมูลประเภทของหนังสือ</title>
      </Head>
      <div>
        <AdminTitle>จัดการข้อมูลประเภทของหนังสือ</AdminTitle>
        <InputWrapper>
          <InputWithIcon
            label="ประเภทหนังสือ"
            placeholder="กรอกชื่อประเภทหนังสือ"
            onChange={setInputType}
            iconName={ICONS.faBook}
            value={inputType}
          ></InputWithIcon>

          <Button btnType="orangeGradient" onClick={submitType} btnSize="sm">
            เพิ่มประเภทใหม่
          </Button>
        </InputWrapper>

        <Table>
          <Thead>
            <tr>
              <td>ID</td>
              <td>ชื่อประเภท</td>
              <td></td>
            </tr>
          </Thead>

          <Tbody>
            {types
              ?.slice(
                (currentPage - 1) * pageSize,
                (currentPage - 1) * pageSize + pageSize
              )
              ?.map((type) => (
                <tr key={type.id}>
                  <td>{type.id}</td>
                  <td>{type.name}</td>
                  <td></td>
                </tr>
              ))}
          </Tbody>
        </Table>

        {Math.ceil(types?.length / pageSize) > 1 && (
          <PaginationWrapper>
            <Pagination
              totalPage={Math.ceil(types.length / pageSize)}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </PaginationWrapper>
        )}
      </div>
    </>
  )
}

export default TypePage
TypePage.Layout = AdminLayout

export const getServerSideProps = (context) => {
  return {
    props: {
      currentPage: context.query.page ? +context.query.page : 1,
    },
  }
}
