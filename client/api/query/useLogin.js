import {useMutation} from 'react-query'
import userService from '../request/userService'

const useLogin = (email, password) => {
  return useMutation('login', () => userService.login(email, password), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: {
      refetchQueries: 'getCurrentUser',
    },
  })
}

export default useLogin
