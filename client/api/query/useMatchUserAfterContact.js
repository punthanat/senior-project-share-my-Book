import toast from 'react-hot-toast'
import {useQueryClient, useMutation} from 'react-query'
import adminService from '../request/adminService'

const useMatchUserAfterContact = () => {
  const queryClient = useQueryClient()
  return useMutation(adminService.matchUserAfterContact, {
    onSuccess: () => {
      toast.success('จับคู่ผู้ใช้สำเร็จ')
      queryClient.invalidateQueries('getReportInfo')
    },
  })
}

export default useMatchUserAfterContact
