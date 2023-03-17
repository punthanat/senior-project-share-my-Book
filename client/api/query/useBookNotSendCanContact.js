import toast from 'react-hot-toast'
import {useQueryClient, useMutation} from 'react-query'
import adminService from '../request/adminService'

const useBookNotSendCanContact = () => {
  const queryClient = useQueryClient()
  return useMutation(adminService.acceptBookNotSendContact, {
    onSuccess: () => {
      toast.success('ดำเนินการสำเร็จ')
      queryClient.invalidateQueries('getReportInfo')
    },
  })
}

export default useBookNotSendCanContact
