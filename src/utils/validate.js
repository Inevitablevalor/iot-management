/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const regex = /^[a-zA-Z0-9_-]{4,16}$/
  return regex.test(str)
}

export function validEmail(str) {
  const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
  return regex.test(str)
}

export function validPassword(str) {
  const regex = /^[A-Za-z0-9]{6,}$/
  return regex.test(str)
}
