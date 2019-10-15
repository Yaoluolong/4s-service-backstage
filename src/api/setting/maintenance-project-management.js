import request from '@/utils/request'

export function query(form, current, size) {
  return request({
    url: '/upKeepProject/Page',
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

export function add(form, total) {
  return request({
    url: '/upKeepProject/insert',
    method: 'post',
    params: {
      projectName: form.projectName,
      upKeepCost: form.upKeepCost,
      totalCost: total,
      prepareCycle: form.prepareCycle,
      description: form.description,
      duration: form.duration
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function addM(id, object) {
  return request({
    url: '/projectDetail/insert',
    method: 'post',
    params: {
      projectId: id,
      material: object.name,
      materialCost: object.cost
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function deleteProject(id) {
  return request({
    url: '/upKeepProject/delete',
    method: 'get',
    params: {
      id
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function selectByState() {
  return request({
    url: '/Crm/selectByState',
    method: 'get',
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function updateState(userId, formState) {
  return request({
    url: '/Crm/updateState',
    method: 'post',
    params: {
      userId,
      formState
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function insert(form) {
  return request({
    url: '/Crm/insert',
    method: 'post',
    params: {
      ...form
    },
    baseURL: 'http://windchaser.natapp1.cc',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

