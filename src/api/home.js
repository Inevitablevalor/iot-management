import request from '@/utils/request'
export function fetchList(query) {
  return request({
    url: '/home/list', // 'http://localhost:5000/article/list
    method: 'get',
    params: query
  })
}
