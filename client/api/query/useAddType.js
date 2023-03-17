import {useQueryClient, useMutation} from 'react-query'
import typeService from '../request/typeService'

const useAddType = () => {
  const queryClient = useQueryClient()
  return useMutation(typeService.addType, {
    onSuccess: () => {
      queryClient.invalidateQueries('getTypes')
    },
  })
}

export default useAddType
