import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login', // 'http://localhost:5000/user/login
    method: 'post',
    data
  })
}
export function register(data) {
  // output to console the data
  return request({
    url: '/user/register', // 'http://localhost:5000/user/register
    method: 'post',
    data
  })
}
export function getInfo(token) {
  return request({
    url: '/user/info', // 'http://localhost:5000/user/info
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout', // 'http://localhost:5000/user/logout
    method: 'post'
  })
}

export function update(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
