import {useQuery} from 'react-query'
import userService from '../request/userService'

const useCurrentUser = () => {
  return useQuery('getCurrentUser', userService.getCurrentUser, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export default useCurrentUser
