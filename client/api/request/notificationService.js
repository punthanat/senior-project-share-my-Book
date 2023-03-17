import {axiosPrivate} from '../axios'

const getMyNotification = () => {
  const res = axiosPrivate.get(`notification/mynotification`)
  return res
}

const getMyNotificationById = (id) => {
  console.log(id)
  const res = axiosPrivate.get(`notification/mynotification/${id}`)
  return res
}

const seenNotification = (seenList) => {
  const res = axiosPrivate.put(`notification/seennotification`, {
    seenList,
  })
  return res
}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  getMyNotification,
  getMyNotificationById,
  seenNotification,
}
