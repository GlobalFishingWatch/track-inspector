import trackValueArrayToPointsArray, {
  Point,
  Field,
  DEFAULT_NULL_VALUE,
} from './trackValueArrayToSegments'

it('fails if fields is empty', () => {
  const callWithoutFields = () => {
    trackValueArrayToPointsArray([], [])
  }
  expect(callWithoutFields).toThrow(new Error())
})

it('return the correct amount of segments and points', () => {
  expect(trackValueArrayToPointsArray([DEFAULT_NULL_VALUE, 1, 0, 0], [Field.speed]).length).toEqual(
    1
  )
  expect(
    trackValueArrayToPointsArray([DEFAULT_NULL_VALUE, 1, 0, 0], [Field.speed])[0].length
  ).toEqual(1)
  expect(
    trackValueArrayToPointsArray([DEFAULT_NULL_VALUE, 3, 0, 1, 2, 0, 0, 0], [Field.speed]).length
  ).toEqual(3)
  expect(
    trackValueArrayToPointsArray([DEFAULT_NULL_VALUE, 3, 0, 1, 2, 0, 0, 0], [Field.speed])[0].length
  ).toEqual(1)
  expect(
    trackValueArrayToPointsArray([DEFAULT_NULL_VALUE, 3, 0, 1, 2, 0, 0, 0], [Field.speed])[1].length
  ).toEqual(1)
  expect(
    trackValueArrayToPointsArray([DEFAULT_NULL_VALUE, 3, 0, 1, 2, 0, 0, 0], [Field.speed])[2].length
  ).toEqual(1)

  const test = trackValueArrayToPointsArray(
    [DEFAULT_NULL_VALUE, 3, 0, 1, 2, 256, 512, 1024, 2048, 4096],
    [Field.speed]
  )
  expect(test[1].length).toEqual(1)
  expect(test[2].length).toEqual(3)
})

it('returns the correct values', () => {
  const test = trackValueArrayToPointsArray(
    [DEFAULT_NULL_VALUE, 3, 0, 1, 2, 0, 0, 0, 0, 1000000],
    [Field.course]
  )
  expect(test[2][2].course).toEqual(1)

  const test1 = trackValueArrayToPointsArray(
    [DEFAULT_NULL_VALUE, 2, 0, 3, 0, 0, 0, 1000000, 2000000, 3000000],
    [Field.course, Field.speed, Field.fishing]
  )
  expect(test1[1][0].course).toEqual(1)
  expect(test1[1][0].speed).toEqual(2)
  expect(test1[1][0].fishing).toEqual(3)

  const test2 = trackValueArrayToPointsArray(
    [DEFAULT_NULL_VALUE, 2, 0, 3, 0, 0, 0, 1000000, 2000000, 42000000],
    [Field.course, Field.lonlat]
  )
  expect(test2[1][0].course).toEqual(1)
  expect(test2[1][0].longitude).toEqual(2)
  expect(test2[1][0].latitude).toEqual(42)
})

it('correctly reads timestamps', () => {
  const test = trackValueArrayToPointsArray(
    [DEFAULT_NULL_VALUE, 1, 0, 1483229046],
    [Field.timestamp]
  )
  expect(test[0][0].timestamp).toEqual(1483229046000)
})

it('correctly reads null values', () => {
  const test = trackValueArrayToPointsArray(
    [DEFAULT_NULL_VALUE, 1, 0, 42, DEFAULT_NULL_VALUE, 1234567],
    [Field.speed]
  )
  expect(test[0][1].speed).toEqual(null)
})
