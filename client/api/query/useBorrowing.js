import {useQuery} from 'react-query'
import userService from '../request/userService'

const useBorrowing = (enabled = true) => {
  return useQuery('getMyBorrowing', userService.currentHoldingBook, {
    enabled,
  })
}

export default useBorrowing
