import {useQuery} from 'react-query'
import adminService from '../request/adminService'

const useReportInfo = (id) => {
  return useQuery('getReportInfo', () => adminService.getReportInfo(id))
}

export default useReportInfo
