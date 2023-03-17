import toast from 'react-hot-toast'
import {useQueryClient, useMutation} from 'react-query'
import adminService from '../request/adminService'

const useAcceptReport = () => {
  const queryClient = useQueryClient()
  return useMutation(adminService.acceptReport, {
    onSuccess: () => {
      toast.success('รับรายงานสำเร็จ')
      queryClient.invalidateQueries('getReportInfo')
    },
  })
}

export default useAcceptReport
