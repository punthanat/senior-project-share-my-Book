import {useMutation} from 'react-query'
import shelfService from '../request/shelfService'

const useDonateBook = (bookData, imageFile) => {
  return useMutation(
    'donateBook',
    () => shelfService.addShelf(bookData, imageFile),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: {
        refetchQueries: 'getCurrentUser',
      },
    }
  )
}

export default useDonateBook
