import Pbf from 'pbf'
export default (data) => {
  const readField = function (tag, obj, pbf) {
    if (tag === 1) pbf.readPackedVarint(obj.data)
  }
  const read = function (pbf, end) {
    return pbf.readFields(readField, { data: [] }, end)
  }
  const pbfData = new Pbf(data)
  const intArray = read(pbfData)
  return intArray && intArray.data
}
