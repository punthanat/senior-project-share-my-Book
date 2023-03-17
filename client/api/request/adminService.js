import axios, {axiosPrivate} from '../axios'

const addAdmin = (adminData) => {
  const res = axiosPrivate.post(`admin/newadmin`, adminData)
  return res
}

const searchReport = (params, size) => {
  const res = axiosPrivate.get(`admin/reportinformation`, {
    params: {...params, size, page: params?.page ? params.page : 1},
  })
  return res
}

const getReportInfo = (id) => {
  const res = axiosPrivate.get(`admin/reportinformation/${id}`)
  return res
}

const acceptReport = (id) => {
  const res = axiosPrivate.put(`admin/acceptreportrequest/${id}`)
  return res
}

const rejectReport = (id) => {
  const res = axiosPrivate.put(`admin/rejectreportrequest/${id}`)
  return res
}

const acceptBookCanRead = (id) => {
  const res = axiosPrivate.put(`admin/bookcanread/${id}`)
  return res
}

const acceptBookCantRead = (id) => {
  const res = axiosPrivate.put(`admin/bookcannotread/${id}`)
  return res
}

const acceptBookNotSendCantContact = (id) => {
  const res = axiosPrivate.put(`admin/booknotsendcannotcontact/${id}`)
  return res
}

const acceptBookNotSendContact = (id) => {
  const res = axiosPrivate.put(`admin/booknotsendcancontact/${id}`)
  return res
}

const confirmBookInfoEdit = (id) => {
  const res = axiosPrivate.put(`admin/bookshelfeditsuccess/${id}`)
  return res
}

const confirmSystemReportBookNotReceive = (id) => {
  const res = axiosPrivate.put(`admin/bookhissystemeditsuccess/${id}`)
  return res
}

const matchUserAfterContact = (id) => {
  const res = axiosPrivate.put(`admin/holdercallback/${id}`)
  return res
}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  addAdmin,
  searchReport,
  getReportInfo,
  acceptReport,
  rejectReport,
  acceptBookCanRead,
  acceptBookCantRead,
  acceptBookNotSendContact,
  acceptBookNotSendCantContact,
  confirmBookInfoEdit,
  confirmSystemReportBookNotReceive,
  matchUserAfterContact,
}
