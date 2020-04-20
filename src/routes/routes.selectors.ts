import { createSelector } from 'reselect'
import { WorkspaceParam } from '../types'
import { DEFAULT_WORKSPACE } from '../constants'

const getLocation = (state: any) => state.location

const getLocationQuery = createSelector([getLocation], (location) => {
  return location.query
})

const getQueryParam = (param: WorkspaceParam) =>
  createSelector([getLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_WORKSPACE[param]
    }
    return query[param]
  })

export const getDataviewsQuery = getQueryParam('dataviewsWorkspace')

export const selectMapZoomQuery = getQueryParam('zoom')
export const selectMapLatitudeQuery = getQueryParam('latitude')
export const selectMapLongitudeQuery = getQueryParam('longitude')
export const getStartQuery = getQueryParam('start')
export const getEndQuery = getQueryParam('end')
