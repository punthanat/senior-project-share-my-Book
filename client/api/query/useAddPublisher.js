import {useMutation, useQueryClient} from 'react-query'
import publisherService from '../request/publisherService'

const useAddPublisher = () => {
  const queryClient = useQueryClient()
  return useMutation(publisherService.addPublisher, {
    onSuccess: () => {
      queryClient.invalidateQueries('getPublishers')
    },
  })
}

export default useAddPublisher
