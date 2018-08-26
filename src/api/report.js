import request from '@/utils/request'

export function selectReport(params) {
  return request({
    url: '/report',
    params
  })
}
export function singleReport(id) {
  return request({
    url: `/report/${id}`
  })
}
export function createReport(data) {
  return request({
    url: '/report',
    method: 'POST',
    data
  })
}
export function updateReport(data) {
  return request({
    url: `/report/${data.id}`,
    method: 'PUT',
    data
  })
}
export function deleteReport(id) {
  return request({
    url: `/report/${id}`,
    method: 'DELETE'
  })
}
