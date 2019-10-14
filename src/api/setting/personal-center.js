import request from '@/utils/request'

export function update(form, username) {
  return request({
    url: '/employee/update',
    method: 'post',
    params: {
      ...form,
      username,
      role: ''
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
