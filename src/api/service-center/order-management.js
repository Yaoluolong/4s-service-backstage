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

export function queryItem() {
  return request({
    url: '/upKeepProject/Page',
    method: 'get',
    params: {
      id: '',
      projectName: '',
      current: 1,
      size: 15
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function queryCustomer() {
  return request({
    url: '/Crm/list',
    method: 'get',
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function queryInfo(phone) {
  return request({
    url: '/Crm/loadByPhone',
    method: 'get',
    params: {
      phone
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function addItem(form) {
  return request({
    url: '/serviceRecord/insert',
    method: 'post',
    params: {
      ...form
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function getProject(list) {
  return request({
    url: '/upKeepProject/List',
    method: 'get',
    list,
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function orderInsert(list) {
  return request({
    url: '/Order/insertOne',
    method: 'post',
    params: {
      ...list
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
