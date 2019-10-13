import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    params: {
      ...data
    },
    // baseURL: 'http://carshop.natapp1.cc',
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  // return request({
  //   url: '/user/login',
  //   method: 'post',
  //   data
  // })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
