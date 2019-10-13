import request from '@/utils/request'

export function query(form, current, size) {
  return request({
    url: '/employee/Page',
    method: 'get',
    params: {
      ...form,
      current,
      size
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
