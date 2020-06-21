import { createSelector } from 'reselect'
import { WorkspaceParam } from 'types'
import { DEFAULT_WORKSPACE } from 'config'
import { RootState } from 'store/store'

const selectLocation = (state: RootState) => state.location

const selectLocationQuery = createSelector([selectLocation], (location) => {
  return location.query
})

const selectAppParam = (param: WorkspaceParam) =>
  createSelector([selectLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_WORKSPACE[param]
    }
    return query[param]
  })

export const selectDataviewsQuery = selectAppParam('workspaceDataviews')

export const selectMapZoomQuery = selectAppParam('zoom')
export const selectMapLatitudeQuery = selectAppParam('latitude')
export const selectMapLongitudeQuery = selectAppParam('longitude')
export const selectStartQuery = selectAppParam('start')
export const selectEndQuery = selectAppParam('end')
export const selectBookmarkStartQuery = selectAppParam('bookmarkStart')
export const selectBookmarkEndQuery = selectAppParam('bookmarkEnd')
export const selectSidebarQuery = selectAppParam('sidebar')

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

export const selectTimebarMode = selectAppParam('timebarMode')
