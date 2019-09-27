import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/login',
    method: 'post',
    params: {
      username: 123,
      password: 123
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
