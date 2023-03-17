import {useQuery} from 'react-query'
import {useCallback} from 'react'
import typeService from '../request/typeService'

const useTypes = () => {
  return useQuery('getTypes', typeService.getAllTypes, {
    select: useCallback((data) => {
      let other = {}
      let otherIndex = null
      let typeFormatArr = data?.data?.map((item, i) => {
        if (item.typeName.toLowerCase() === 'other') {
          otherIndex = i
          other = {id: item._id, name: item.typeName}
        }
        return {
          id: item._id,
          name: item.typeName,
        }
      })

      if (otherIndex) {
        typeFormatArr.splice(otherIndex, 1)
        typeFormatArr.push(other)
      }

      return typeFormatArr
    }, []),
    refetchOnMount: false,
  })
}

export default useTypes
