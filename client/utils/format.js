export const thaiMonths = {
  short: [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ],
  full: [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ],
}

export const formatDate = (
  isoStringDate,
  isShortMonth = true,
  isNationalYear = true,
  showTime = false
) => {
  let dateParse = new Date(isoStringDate)
  let year = isNationalYear
    ? dateParse.getFullYear()
    : dateParse.getFullYear() + 543
  let month = thaiMonths[isShortMonth ? 'short' : 'full'][dateParse.getMonth()]
  let date = dateParse.getDate()

  let hour = dateParse.getHours()
  let mins = dateParse.getMinutes()
  if (mins.toString().length < 2) {
    mins = '0' + mins
  }

  if (showTime) {
    return date + ' ' + month + ' ' + year + ' / ' + hour + ':' + mins + ' น.'
  }

  return date + ' ' + month + ' ' + year
}
