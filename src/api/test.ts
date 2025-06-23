import request from '@/utils/request'

interface ParamsData {
  [key: string]: any
}

export function getPeopleListApi (data: ParamsData,_arg1?:any,_arg2?:any) {
  // console.log('getPeopleListApi', data, 'arg1',arg1,'arg2',arg2)
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
export function editPeopleApi(data: Test.People, arg1?: any, arg2?: any) {
  console.log('editPeopleApi', data, 'arg1',arg1,'arg2',arg2)
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