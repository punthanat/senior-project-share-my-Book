import toast from 'react-hot-toast'
import {useQueryClient, useMutation} from 'react-query'
import adminService from '../request/adminService'

const useReportBookInfoEdit = () => {
  const queryClient = useQueryClient()
  return useMutation(adminService.confirmBookInfoEdit, {
    onSuccess: () => {
      toast.success('ดำเนินการสำเร็จ')
      queryClient.invalidateQueries('getReportInfo')
    },
  })
}

export default useReportBookInfoEdit
