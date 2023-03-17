import toast from 'react-hot-toast'
import {useQueryClient, useMutation} from 'react-query'
import adminService from '../request/adminService'

const useBookNotSendCantContact = () => {
  const queryClient = useQueryClient()
  return useMutation(adminService.acceptBookNotSendCantContact, {
    onSuccess: () => {
      toast.success('ดำเนินการสำเร็จ')
      queryClient.invalidateQueries('getReportInfo')
    },
  })
}

export default useBookNotSendCantContact
