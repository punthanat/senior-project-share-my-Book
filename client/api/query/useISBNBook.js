import {useQuery} from 'react-query'
import shelfService from '../request/shelfService'

const useISBNbook = (isbn) => {
  return useQuery('getBookByIsbn', () => shelfService.getShelfByIsbn(isbn))
}

export default useISBNbook
