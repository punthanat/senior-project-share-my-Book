import styled, {css} from 'styled-components'
import {COLORS} from '../styles/colors'
import {SPACING} from '../styles/spacing'
import {useDispatch, useSelector} from 'react-redux'
import {clearUser} from '../redux/feature/UserSlice'
import userService from '../api/request/userService'
import {useRouter} from 'next/router'
import Icon from './Icon'
import {ICONS} from '../config/icon'
import {useSocket} from '../contexts/Socket'

const SideBarStyled = styled.div`
  background-color: ${COLORS.PURPLE_3};
  padding: ${SPACING.MD};
  display: flex;
  flex-direction: column;
  gap: ${SPACING.MD};
  flex-shrink: 0;
  min-width: 250px;
`

const ActiveItemStyled = css`
  background-color: ${COLORS.PURPLE_2};
  cursor: pointer;
`

const SecondItemStyled = css`
  background-color: ${COLORS.PURPLE};
  display: flex;
  gap: ${SPACING.MD};
  align-items: center;
  justify-content: space-between;
  cursor: default;
`

const HeadItemStyled = css`
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const SideBarItem = styled.div`
  color: ${COLORS.WHITE};
  padding: ${SPACING.MD};
  border-radius: ${SPACING.MD};
  transition: 0.2s;
  ${(props) => props.isActive && ActiveItemStyled}
  ${(props) => props.isSecondary && SecondItemStyled}

  > span {
    ${(props) => props.isHead && HeadItemStyled}
  }

  &:hover {
    ${ActiveItemStyled}
    ${(props) => props.isSecondary && SecondItemStyled}
  }
`

const SideBar = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const user = useSelector((state) => state.user.user)
  const {socket} = useSocket()

  const logoutHandler = async () => {
    const getResult = async () => await userService.logout()
    return getResult()
      .then(() => {
        socket.on('logout', () => {})
        dispatch(clearUser())
        router.push('/')
      })
      .catch((res) => {
        if (res.response.status !== 200) {
          dispatch(clearUser())
          return router.push('/')
        }
      })
  }

  return (
    <SideBarStyled>
      <SideBarItem isSecondary isHead={true}>
        <span>{user.email}</span>
        <Icon name={ICONS.faUserShield} />
      </SideBarItem>

      <SideBarItem
        onClick={() => router.push('/admin/newadmin')}
        isActive={router.pathname === '/admin/newadmin'}
      >
        เพิ่ม Admin
      </SideBarItem>
      <SideBarItem
        onClick={() => router.push('/admin/search')}
        isActive={router.pathname === '/admin/search'}
      >
        ค้นหาหนังสือ
      </SideBarItem>
      <SideBarItem
        onClick={() => router.push('/admin/types')}
        isActive={router.pathname === '/admin/types'}
      >
        จัดการประเภทหนังสือ
      </SideBarItem>
      <SideBarItem
        onClick={() => router.push('/admin/publishers')}
        isActive={router.pathname === '/admin/publishers'}
      >
        จัดการข้อมูลสำนักพิมพ์
      </SideBarItem>
      <SideBarItem
        onClick={() => router.push('/admin/report')}
        isActive={router.pathname === '/admin/report'}
      >
        ข้อมูลการรายงาน
      </SideBarItem>
      <SideBarItem
        onClick={() => router.push('/admin/forwarding')}
        isActive={router.pathname === '/admin/forwarding'}
      >
        หนังสือที่ต้องส่งต่อ
      </SideBarItem>
      <SideBarItem
        onClick={() => router.push('/admin/edit')}
        isActive={router.pathname === '/admin/edit'}
      >
        แก้ไขข้อมูลส่วนตัว
      </SideBarItem>
      <SideBarItem onClick={logoutHandler}>ออกจากระบบ</SideBarItem>
    </SideBarStyled>
  )
}

export default SideBar
