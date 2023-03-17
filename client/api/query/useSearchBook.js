import {useQuery} from 'react-query'
import shelfService from '../request/shelfService'

export const useSearchBook = (param) => {
  return useQuery('searchBook', () => shelfService.searchBookShelf(param))
}
