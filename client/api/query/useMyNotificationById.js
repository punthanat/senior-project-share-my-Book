import {useQuery} from 'react-query'
import notificationService from '../request/notificationService'

const useMyNotificationById = (notificationId, enabled = true) => {
  return useQuery(
    'getMyNotificationById',
    () => notificationService.getMyNotificationById(notificationId),
    {
      enabled,
    }
  )
}

export default useMyNotificationById
