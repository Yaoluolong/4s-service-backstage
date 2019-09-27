import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/login',
    method: 'post',
    params: {
      username: 123,
      password: 123
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
