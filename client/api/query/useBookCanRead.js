import toast from 'react-hot-toast'
import {useQueryClient, useMutation} from 'react-query'
import adminService from '../request/adminService'

const useBookCanRead = () => {
  const queryClient = useQueryClient()
  return useMutation(adminService.acceptBookCanRead, {
    onSuccess: () => {
      toast.success('ดำเนินการสำเร็จ')
      queryClient.invalidateQueries('getReportInfo')
    },
  })
}

export default useBookCanRead
