import { createSelector } from 'reselect'

export type WorkspaceParam = 
  | 'dataviews'
  | 'zoom'
  | 'latitude'
  | 'longitude'

export type QueryParam =
  | WorkspaceParam

type DefaulQueryTypes = { [key in QueryParam]: any }
const DEFAULT_APP_PARAMS:DefaulQueryTypes = {
  dataviews: [],
  zoom: 3,
  latitude: 0,
  longitude: 0
}

const getLocation = (state: any) => state.location

const getLocationQuery = createSelector([getLocation], (location) => {
  return location.query
})

const getQueryParam = (param: QueryParam) =>
  createSelector([getLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_APP_PARAMS[param]
    }
    return query[param]
  })

export const getDataviewsQuery = getQueryParam('dataviews')

export const getMapZoomQuery = createSelector([getQueryParam('zoom')], (value) => parseFloat(value))
export const getMapLatitudeQuery = createSelector([getQueryParam('latitude')], (value) => parseFloat(value))
export const getMapLongitudeQuery = createSelector([getQueryParam('longitude')], (value) => parseFloat(value))
