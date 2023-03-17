import {useQueryClient, useMutation} from 'react-query'
import userService from '../request/userService'

const useConfirmSend = () => {
  const queryClient = useQueryClient()
  return useMutation(userService.confirmForwarding, {
    onSuccess: () => {
      queryClient.invalidateQueries('getForwardingRequest')
    },
  })
}

export default useConfirmSend
