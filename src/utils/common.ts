import moment from 'moment'

// 时间格式
export function dateFormat(val: string, type = 'YYYY-MM-DD HH:mm:ss') {
  if (!val) return ''
  const tz = JSON.stringify(val).includes('z') ? 0 : 8
  if (val && val !== '0001-01-01T00:00:00') {
    return moment(val).utcOffset(tz).format(type)
  } else {
    return ' '
  }
}

export function hasField(obj: any, field: string) {
  return Object.hasOwnProperty.call(obj, field)
}