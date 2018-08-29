import request from '@/utils/request'

export function selectConfig(params) {
  return request({
    url: '/config',
    params
  })
}
export function singleConfig(id) {
  return request({
    url: `/config/${id}`
  })
}
export function createConfig(data) {
  return request({
    url: '/config',
    method: 'POST',
    data
  })
}
export function updateConfig(data) {
  return request({
    url: `/config/${data.id}`,
    method: 'PUT',
    data
  })
}
export function deleteConfig(id) {
  return request({
    url: `/config/${id}`,
    method: 'DELETE'
  })
}
