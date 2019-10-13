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

export function remove(id) {
  return request({
    url: '/employee/delete',
    method: 'get',
    params: {
      id
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function update(id, password, role) {
  return request({
    url: '/employee/update',
    method: 'post',
    params: {
      id, password, role
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function add(form) {
  return request({
    url: '/employee/insert',
    method: 'post',
    params: {
      ...form
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
