import React from 'react'
import adminService from '../../api/request/adminService'
import {AdminTitle} from '../../components/Admin'
import RegisterForm from '../../components/forms/RegisterForm'
import AdminLayout from '../../components/layouts/AdminLayout'

const NewAdminPage = () => {
  return (
    <div>
      <AdminTitle>เพิ่ม Admin ใหม่</AdminTitle>
      <RegisterForm adminForm={true}></RegisterForm>
    </div>
  )
}

export default NewAdminPage
NewAdminPage.Layout = AdminLayout
