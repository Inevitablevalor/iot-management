import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/article/list', // 'http://localhost:5000/article/list
    method: 'get',
    params: query
  })
}

export function createArticle(newdata) {
  return request({
    url: '/article/create', // 'http://localhost:5000/article/create
    method: 'get',
    params: newdata
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update', // 'http://localhost:5000/article/update
    method: 'post',
    data
  })
}

export function deleteArticle(data) {
  return request({
    url: '/article/delete', // 'http://localhost:5000/article/delete
    method: 'post',
    data
  })
}

