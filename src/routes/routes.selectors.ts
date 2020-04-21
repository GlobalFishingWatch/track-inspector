import { createSelector } from 'reselect'
import { WorkspaceParam } from '../types'
import { DEFAULT_WORKSPACE } from '../constants'

const selectLocation = (state: any) => state.location

const selectLocationQuery = createSelector([selectLocation], (location) => {
  return location.query
})

const selectQueryParam = (param: WorkspaceParam) =>
  createSelector([selectLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_WORKSPACE[param]
    }
    return query[param]
  })

export const getDataviewsQuery = selectQueryParam('dataviewsWorkspace')

export const selectMapZoomQuery = selectQueryParam('zoom')
export const selectMapLatitudeQuery = selectQueryParam('latitude')
export const selectMapLongitudeQuery = selectQueryParam('longitude')
export const selectStartQuery = selectQueryParam('start')
export const selectEndQuery = selectQueryParam('end')
