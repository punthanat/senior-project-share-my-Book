import toast from 'react-hot-toast'
import {useQueryClient, useMutation} from 'react-query'
import adminService from '../request/adminService'

const useBookCantRead = () => {
  const queryClient = useQueryClient()
  return useMutation(adminService.acceptBookCantRead, {
    onSuccess: () => {
      toast.success('ดำเนินการสำเร็จ')
      queryClient.invalidateQueries('getReportInfo')
    },
  })
}

export default useBookCantRead
