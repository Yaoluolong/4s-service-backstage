import request from '@/utils/request'

export function query(form, current, size) {
  return request({
    url: '/Order/Page',
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

export function queryDetail(data) {
  return request({
    url: '/reservation-center/reservation-management/detail',
    method: 'post',
    params: data,
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function modifyDate(id, date) {
  return request({
    url: '/Order/updateTime',
    method: 'post',
    params: {
      id,
      upKeepTime: date
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function modifyItem(data) {
  return request({
    url: '/reservation-center/reservation-management/detail',
    method: 'post',
    params: data,
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function queryItem() {
  return request({
    url: '/upKeepProject/List',
    method: 'get',
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function deal(id, orderState) {
  return request({
    url: '/Order/update',
    method: 'post',
    params: {
      id, orderState
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

