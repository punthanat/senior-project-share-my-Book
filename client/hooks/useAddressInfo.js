import {useSelector} from 'react-redux'

export const useAddressInfo = () => {
  const user = useSelector((state) => state.user.user)

  if (
    user.firstname &&
    user.firstname.length > 0 &&
    user.lastname &&
    user.lastname.length > 0 &&
    user.address &&
    user.address.length > 0 &&
    user.tel &&
    user.tel.length >= 9
  ) {
    return true
  } else {
    return false
  }
}

export default useAddressInfo
