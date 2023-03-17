import {useQuery} from 'react-query'
import notificationService from '../request/notificationService'

const useMyNotification = (enabled = true) => {
  return useQuery('getMyNotification', notificationService.getMyNotification, {
    enabled,
  })
}

export default useMyNotification
