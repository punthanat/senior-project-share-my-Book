import toast from 'react-hot-toast'
import {useQueryClient, useMutation} from 'react-query'
import userService from '../request/userService'

const useConfirmReadingSuccess = () => {
  const queryClient = useQueryClient()
  return useMutation(userService.confirmReadingSuccess, {
    onSuccess: () => {
      queryClient.invalidateQueries('getMyBorrowing')
      toast.success('ยืนยันข้อมูลการอ่านสำเร็จเรียบร้อย')
    },
    onError: (err) => {
      console.log(err)
    },
  })
}

export default useConfirmReadingSuccess
