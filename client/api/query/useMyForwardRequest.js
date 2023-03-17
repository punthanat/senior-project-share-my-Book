import {useQuery} from 'react-query'
import userService from '../request/userService'

const useMyForwardRequest = (enabled = true) => {
  return useQuery('getForwardingRequest', userService.forwardingRequest, {
    enabled,
  })
}

export default useMyForwardRequest
