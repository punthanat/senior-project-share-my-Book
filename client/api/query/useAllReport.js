import {useQuery} from 'react-query'
import adminService from '../request/adminService'

const useAllReport = (pageSize, pageNo) => {
  return useQuery('getAllReport', () =>
    adminService.getAllReport(pageSize, pageNo)
  )
}

export default useAllReport
