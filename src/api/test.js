import request from '@/utils/request'

export function fetch() {
  return request({
    url: '/login',
    method: 'post',
    params: {
      username: 'zero1997',
      password: '123456'
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
export function table() {
  return request({
    url: '/Order/List',
    method: 'get',
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
export function ls() {
  return request({
    url: '/login',
    method: 'post',
    params: {
      name: 'ys',
      pwd: '123'
    },
    baseURL: 'http://carshop.natapp1.cc',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
