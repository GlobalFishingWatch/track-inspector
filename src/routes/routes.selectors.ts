import { createSelector } from 'reselect'
import { Query } from 'redux-first-router'
import { WorkspaceDataview } from '@globalfishingwatch/dataviews-client'
import { WorkspaceParam } from 'types'
import { DEFAULT_WORKSPACE } from 'config'
import { RootState } from 'store/store'

const selectLocation = (state: RootState) => state.location

const selectLocationQuery = createSelector([selectLocation], (location) => {
  return location.query as Query
})

const selectAppParam = <T = any>(param: WorkspaceParam) =>
  createSelector<RootState, Query, T>([selectLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_WORKSPACE[param]
    }
    return query[param]
  })

export const selectDataviewsQuery = selectAppParam<WorkspaceDataview[]>('workspaceDataviews')

export const selectMapZoomQuery = selectAppParam<number>('zoom')
export const selectMapLatitudeQuery = selectAppParam<number>('latitude')
export const selectMapLongitudeQuery = selectAppParam<number>('longitude')
export const selectStartQuery = selectAppParam<string>('start')
export const selectEndQuery = selectAppParam<string>('end')
export const selectBookmarkStartQuery = selectAppParam<string>('bookmarkStart')
export const selectBookmarkEndQuery = selectAppParam<string>('bookmarkEnd')
export const selectSidebarQuery = selectAppParam<boolean>('sidebar')

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
