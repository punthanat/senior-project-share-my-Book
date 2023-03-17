import {useQuery} from 'react-query'
import userService from '../request/userService'

const useMyReport = (enabled = true) => {
  return useQuery('getMyReport', userService.getMyReport, {
    enabled,
  })
}

export default useMyReport
