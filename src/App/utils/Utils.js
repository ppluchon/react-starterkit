/*
*   NETWORK
*/

export const URLify = str => {
  str = str.replace(/'/gm, '')
  str = str.replace(/ /gm, '-')
  return str
}

export const Status = response => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

export const ToJson = response => {
  return response.json()
}
