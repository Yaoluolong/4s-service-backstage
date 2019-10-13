import request from '@/utils/request'

export function query(form, current, size) {
  return request({
    url: '/stockUpSheet/Page',
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

export function deal(stockUpId, orderId, state) {
  return request({
    url: '/stockUpSheet/update',
    method: 'post',
    params: {
      stockUpId,
      orderId,
      stockUpState: state,
      wareManagerId: ''
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
