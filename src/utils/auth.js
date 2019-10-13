import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserName = 'sam'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserName() {
  return Cookies.get(UserName)
}

export function setUserName(token) {
  return Cookies.set(UserName, token)
}

export function removeUserName() {
  return Cookies.remove(UserName)
}
