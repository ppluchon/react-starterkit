export const URLify = str => {
  str = str.replace(/'/gm, '')
  str = str.replace(/ /gm, '-')
  return str
}
