import toast from 'react-hot-toast'
import {useQueryClient, useMutation} from 'react-query'
import adminService from '../request/adminService'

const useRejectReport = () => {
  const queryClient = useQueryClient()
  return useMutation(adminService.rejectReport, {
    onSuccess: () => {
      toast.success('ยกเลิกรายงานสำเร็จ')
      queryClient.invalidateQueries('getReportInfo')
    },
  })
}

export default useRejectReport
