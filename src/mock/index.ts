import Mock from 'mockjs'

const getQuery = (url, name) => {
  const index = url.indexOf('?')
  if (index !== -1) {
    const queryStrArr = url.substr(index + 1).split('&')
    for (let i = 0; i < queryStrArr.length; i++) {
      const itemArr = queryStrArr[i].split('=')
      // console.log(itemArr)
      if (itemArr[0] === name) {
        return itemArr[1]
      }
    }
  }
  return null
}
 
const data: {list: Test.People[]} = Mock.mock({
  'list|160': [
    {
      'id': '@increment(1)',
      name: '@cname',
      'age|1-100': 10,
      'sex|1': [ 0, 1 ],
      'address|1': '@county(true)',
      'createTime|1': '@datetime("")',
      'switch|1': [ true, false ],
      'score|1-100.1-2': 1
    }
  ]
})
console.log(data)
Mock.mock(/\/api\/people/, 'get', options => {
  // console.log('get', options)
  const SkipCount = getQuery(options.url, 'SkipCount') || 0
  const MaxResultCount = getQuery(options.url, 'MaxResultCount') || 999
  const sex = getQuery(options.url, 'sex')
  const keyword = getQuery(options.url, 'keyword')
  // console.log(SkipCount, MaxResultCount, sex, keyword)
  const sortData: Test.People[] = data.list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
  let items: Test.People[] = [],totalCount = 0
  if ((keyword !== null && keyword !== '') || (sex !== null && sex !== '')) {
    // console.log('keyword', decodeURIComponent(keyword))
    const filterData = sortData.filter(item => (item.name.includes(decodeURIComponent(keyword)) || item.address.includes(decodeURIComponent(keyword))) && item.sex === Number(sex))
    items = filterData.slice(Number(SkipCount), Number(SkipCount) + Number(MaxResultCount))
    totalCount = filterData.length
  }else {
    items = sortData.slice(Number(SkipCount), Number(SkipCount) + Number(MaxResultCount))
    totalCount = sortData.length
  }
  console.log(items)
  return {
    items,
    totalCount
  }
})
Mock.mock('/api/people', 'post', options => {
  // console.log(options)
  const body = JSON.parse(options.body)
  data.list.push(Mock.mock({
    'id': '@increment(1)',
    createTime: new Date(),
    ...body
  }))
  return {
    code: 200
  }
})
Mock.mock('/api/people', 'put', options => {
  // console.log(options)
  const body = JSON.parse(options.body)
  const item = data.list.find(item => item.id === body.id)
  Object.assign(item!, body)
  return {
    code: 200
  }
})
Mock.mock(/\/api\/people/, 'delete', options => {
  // console.log(options)
  const id = options.url.substr(options.url.lastIndexOf('/') + 1)
  // console.log('id',id)
  const index = data.list.findIndex(item => item.id === Number(id))
  console.log(index)
  if (index !== -1) {
    data.list.splice(index, 1)
  }
  return {
    code: 200
  }
})
export default data