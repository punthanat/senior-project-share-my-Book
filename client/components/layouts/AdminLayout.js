import React, {useEffect} from 'react'
import SideBar from '../SideBar'
import styled from 'styled-components'
import {SPACING} from '../../styles/spacing'
import {useDispatch, useSelector} from 'react-redux'
import {fetchCurrentUser} from '../../redux/feature/UserSlice'
import {useSocket} from '../../contexts/Socket'

const AdminPageLayout = styled.div`
  display: flex;
  justify-content: stretch;
  gap: ${SPACING.MD};
  min-height: 100vh;
`

const ContentLayout = styled.div`
  margin: 0 auto;
  padding: ${SPACING.LG} ${SPACING.MD};
  width: 100%;
`

const AdminLayout = ({children}) => {
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const {socket} = useSocket()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  useEffect(() => {
    if (user.email) {
      socket?.emit('signIn', {
        email: user.email,
      })
    }
  }, [user.email, socket])

  return (
    <AdminPageLayout>
      <SideBar />
      <ContentLayout>{children}</ContentLayout>
    </AdminPageLayout>
  )
}

export default AdminLayout
