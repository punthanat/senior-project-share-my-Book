import Head from 'next/head'
import Image from 'next/image'
import React, {useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Button} from '../../components'
import ProfileLayout from '../../components/layouts/ProfileLayout'
import {formatDate} from '../../utils/format'
import styled from 'styled-components'
import {SPACING} from '../../styles/spacing'
import ConfirmModal from '../../components/ConfirmModal'
import {fetchCurrentUser} from '../../redux/feature/UserSlice'
import {ICONS} from '../../config/icon'
import {COLORS} from '../../styles/colors'
import userService from '../../api/request/userService'
import Pagination from '../../components/Pagination'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'

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

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: ${SPACING.MD};
  justify-content: start;
  width: 100%;
`

const DonationCount = styled.span`
  font-size: 14px;
  color: ${COLORS.GRAY_DARK};
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
`

const PaginationWrapper = styled.div`
  border-radius: 28px;
  margin: ${SPACING.MD} auto;
  padding: ${SPACING.MD};
  width: 100%;
  display: flex;
  justify-content: center;
`

const EmptyRow = styled.td`
  padding: ${SPACING['5X']} 0;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
`

const MyDonationPage = ({currentPage}) => {
  const pageSize = 5
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState({})
  const router = useRouter()
  const dispatch = useDispatch()
  const donationHistory = useSelector(
    (state) => state.user?.user?.donationHistory
  )
  const userId = useSelector((state) => state.user?.user?._id)
  let donationFormat = useMemo(
    () =>
      donationHistory?.map((history) => {
        return {
          _id: history?._id,
          bookId: history?.book?._id,
          ISBN: history?.book?.bookShelf?.ISBN,
          bookName: history?.book?.bookShelf?.bookName,
          imageCover: history?.book?.bookShelf?.imageCover,
          currentHolder: history?.book?.currentHolder,
          bookHistorys: history?.book?.bookHistorys,
          donationTime: history?.donationTime,
        }
      }),
    [donationHistory]
  )

  const handleDeleteSubmit = () => {
    userService.cancelDonation(deleteItem?.bookId).then(() => {
      toast.success('ยกเลิกการบริจาคสำเร็จ')
      dispatch(fetchCurrentUser())
      setShowCancelModal(false)
      setDeleteItem({})
    })
  }

  const handleShowModal = () => {
    setShowCancelModal(false)
    setDeleteItem({})
  }

  const onPageChange = (page) => {
    router.push({pathname: '/profile/mydonation', query: {page}})
  }

  return (
    <>
      <Head>
        <title>ประวัติการบริจาคของคุณ</title>
      </Head>
      <ConfirmModal
        onSubmit={handleDeleteSubmit}
        onClose={handleShowModal}
        onShow={showCancelModal}
        header={`คุณต้องการยกเลิกการบริจาค ${deleteItem.bookName} จริงๆ หรอ?`}
        icon={ICONS.faFaceSadTear}
        iconBg={COLORS.RED_1}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            width: '70%',
          }}
        >
          <Button
            btnSize="sm"
            bgColor={COLORS.RED_1}
            onClick={handleShowModal}
            fullWidth
            borderRadius="4px"
          >
            ยกเลิก
          </Button>
          <Button
            btnSize="sm"
            onClick={handleDeleteSubmit}
            fullWidth
            borderRadius="4px"
          >
            ยืนยัน
          </Button>
        </div>
      </ConfirmModal>

      <TitleWrapper>
        <Title>หนังสือที่คุณบริจาคทั้งหมด</Title>
        <DonationCount>
          บริจาคแล้วทั้งหมด {donationHistory?.length} เล่ม
        </DonationCount>
      </TitleWrapper>

      <Table>
        <Thead>
          <tr>
            <Td>ภาพหน้าปก</Td>
            <Td>ISBN</Td>
            <Td>ชื่อหนังสือ</Td>
            <Td>วันที่บริจาค</Td>
            <Td></Td>
          </tr>
        </Thead>

        {donationFormat?.length > 0 ? (
          <Tbody>
            {donationFormat
              ?.slice(
                (currentPage - 1) * pageSize,
                (currentPage - 1) * pageSize + pageSize
              )
              ?.map((row, i) => (
                <tr key={`row${i}`}>
                  <Td>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${row.imageCover}`}
                      alt={row.bookName}
                      width={80}
                      height={100}
                      objectFit="contain"
                    />
                  </Td>
                  <Td>
                    <span>ISBN</span>
                    <span>{row.ISBN}</span>
                  </Td>
                  <Td>
                    <span>ชื่อหนังสือ</span>
                    <span>{row.bookName}</span>
                  </Td>
                  <Td>
                    <span>วันที่บริจาค</span>
                    <span>
                      {formatDate(row.donationTime, true, true, true)}{' '}
                    </span>
                  </Td>
                  <Td>
                    {row?.bookHistorys?.length < 2 &&
                    row.currentHolder === userId ? (
                      <Button
                        btnSize="sm"
                        btnType="orangeGradient"
                        onClick={() => {
                          setShowCancelModal(true)
                          setDeleteItem({
                            bookId: row.bookId,
                            bookName: row?.bookName,
                          })
                        }}
                      >
                        ยกเลิกการบริจาค
                      </Button>
                    ) : (
                      <Button btnSize="sm" isDisabled>
                        หนังสือมีคำขอยืมแล้ว
                      </Button>
                    )}
                  </Td>
                </tr>
              ))}
          </Tbody>
        ) : (
          <tbody>
            <tr>
              <EmptyRow colSpan="5">คุณยังไม่เคยบริจาคหนังสือ</EmptyRow>
            </tr>
          </tbody>
        )}
      </Table>

      {Math.ceil(donationHistory?.length / pageSize) > 1 && (
        <PaginationWrapper>
          <Pagination
            totalPage={Math.ceil(donationHistory.length / pageSize)}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </PaginationWrapper>
      )}
    </>
  )
}

MyDonationPage.Layout = ProfileLayout

export default MyDonationPage

export const getServerSideProps = (context) => {
  return {
    props: {
      currentPage: context.query.page ? +context.query.page : 1,
    },
  }
}
