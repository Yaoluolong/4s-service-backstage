import request from '@/utils/request'

export function query(form, current, size) {
  return request({
    url: '/serviceRecord/Page',
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

export function deal(id, serviceState) {
  return request({
    url: '/serviceRecord/updateState',
    method: 'post',
    params: {
      id, serviceState
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
