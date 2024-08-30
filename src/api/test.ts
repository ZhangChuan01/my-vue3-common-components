import request from '@/utils/request'

interface ParamsData {
  [key: string]: any
}

export function getPeopleListApi (data: ParamsData) {
  return request({
    url: '/api/people',
    method: 'get',
    params: data
  })
}

export function addPeopleApi (data: Test.People) {
  return request({
    url: '/api/people',
    method: 'post',
    data
  })
}
export function editPeopleApi(data: Test.People) {
  return request({
    url: '/api/people',
    method: 'put',
    data
  })
}

export function deletePeopleApi(data: Test.People) {
  return request({
    url: `/api/people/${data.id}`,
    method: 'delete'
  })
}