import { createSelector } from 'reselect'

import { WorkspaceParam } from 'types'
import { DEFAULT_WORKSPACE } from 'config'
import { RootState } from 'store/store'

const selectLocation = (state: RootState) => state.location

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

export const selectDataviewsQuery = selectQueryParam('dataviewsWorkspace')

export const selectMapZoomQuery = selectQueryParam('zoom')
export const selectMapLatitudeQuery = selectQueryParam('latitude')
export const selectMapLongitudeQuery = selectQueryParam('longitude')
export const selectStartQuery = selectQueryParam('start')
export const selectEndQuery = selectQueryParam('end')
export const selectBookmarkStartQuery = selectQueryParam('bookmarkStart')
export const selectBookmarkEndQuery = selectQueryParam('bookmarkEnd')
export const selectSidebarQuery = selectQueryParam('sidebar')
export const selectAlwaysRequireAuthQuery = selectQueryParam('alwaysRequireAuth')

export const selectViewport = createSelector(
  [selectMapZoomQuery, selectMapLatitudeQuery, selectMapLongitudeQuery],
  (zoom, latitude, longitude) => ({
    zoom,
    latitude,
    longitude,
  })
)

export const selectTimerange = createSelector([selectStartQuery, selectEndQuery], (start, end) => ({
  start,
  end,
}))

export const selectBookmarkTimerange = createSelector(
  [selectBookmarkStartQuery, selectBookmarkEndQuery],
  (bookmarkStart, bookmarkEnd) => ({
    bookmarkStart,
    bookmarkEnd,
  })
)

export const selectTimebarMode = selectQueryParam('timebarMode')
