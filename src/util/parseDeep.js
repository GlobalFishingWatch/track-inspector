import { isObject, isArray, mapValues } from 'lodash'

// Recursively (through array and objects) converts string to their intended type
const parseDeep = (obj) => {
  const parse = (value) => {
    if (value === 'true') return true
    if (value === 'false') return false
    if (!isNaN(parseInt(value)) && /^\d+$/.test(value)) return parseInt(value)
    return value
  }
  if (isArray(obj)) {
    return obj.map(parseDeep)
  } else if (isObject(obj)) {
    return mapValues(obj, parseDeep)
  }
  return parse(obj)
}

export default parseDeep
