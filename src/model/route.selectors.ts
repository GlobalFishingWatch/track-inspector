import { createSelector } from 'reselect'
import { QueryParam } from '../types/types'
import { DEFAULT_WORKSPACE } from '../constants'

const getLocation = (state: any) => state.location

const getLocationQuery = createSelector([getLocation], (location) => {
  return location.query
})

const getQueryParam = (param: QueryParam) =>
  createSelector([getLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_WORKSPACE[param]
    }
    return query[param]
  })

export const getDataviewsQuery = getQueryParam('dataviewsWorkspace')

export const getMapZoomQuery = getQueryParam('zoom')
export const getMapLatitudeQuery = getQueryParam('latitude')
export const getMapLongitudeQuery = getQueryParam('longitude')
export const getStartQuery = getQueryParam('start')
export const getEndQuery = getQueryParam('end')
