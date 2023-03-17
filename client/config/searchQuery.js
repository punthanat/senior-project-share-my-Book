import {bookSortList} from './sortList'

export const default_param = {
  page: 1,
  ...bookSortList[0].id,
}

export const default_report_param = {
  page: 1,
}
