import {useQueryClient, useMutation} from 'react-query'
import userService from '../request/userService'

const useConfirmReceive = () => {
  const queryClient = useQueryClient()
  return useMutation(userService.confirmReceive, {
    onSuccess: () => {
      queryClient.invalidateQueries('getBorrowRequest')
    },
  })
}

export default useConfirmReceive
