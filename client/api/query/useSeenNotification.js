import {useQueryClient, useMutation} from 'react-query'
import notificationService from '../request/notificationService'

const useSeenNotification = () => {
  const queryClient = useQueryClient()
  return useMutation(notificationService.seenNotification, {
    onSuccess: () => {
      queryClient.invalidateQueries('getMyNotification')
    },
  })
}

export default useSeenNotification
