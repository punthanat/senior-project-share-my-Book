import {useQuery} from 'react-query'
import userService from '../request/userService'

const useBorrowHistory = (enabled = true) => {
  return useQuery('getMyBorrowHistory', userService.borrowHistory, {
    enabled,
  })
}

export default useBorrowHistory
