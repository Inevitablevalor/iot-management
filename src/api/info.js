import request from '@/utils/request'

export function fetchInfoList(query) {
  return request({
    url: '/info/list', // 'http://localhost:5000/info/list
    method: 'get',
    params: query
  })
}
