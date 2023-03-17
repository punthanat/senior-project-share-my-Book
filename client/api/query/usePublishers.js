import {useQuery} from 'react-query'
import {useCallback} from 'react'
import publisherService from '../request/publisherService'

const usePublishers = () => {
  return useQuery('getPublishers', publisherService.getAllPublisher, {
    select: useCallback((data) => {
      let other = {}
      let otherIndex = null
      let publisherFormatArr = data?.data?.map((item, i) => {
        if (item.publisherName.toLowerCase() === 'other') {
          otherIndex = i
          other = {id: item._id, name: item.publisherName}
        }
        return {
          id: item._id,
          name: item.publisherName,
        }
      })

      if (otherIndex) {
        publisherFormatArr.splice(otherIndex, 1)
        publisherFormatArr.push(other)
      }

      return publisherFormatArr
    }, []),
    refetchOnMount: false,
  })
}

export default usePublishers
