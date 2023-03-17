import React from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import {AdminTitle} from '../../components/Admin'

const AdminPage = () => {
  return (
    <div>
      <AdminTitle>ระบบจัดการข้อมูลของผู้ดูแลระบบ (Admin)</AdminTitle>
    </div>
  )
}

export default AdminPage

AdminPage.Layout = AdminLayout
