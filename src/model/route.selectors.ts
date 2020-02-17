import { createSelector } from 'reselect'

export type WorkspaceParam = 
  | 'zoom'
  | 'latitude'
  | 'longitude'
  | 'dataviews'

export type QueryParam =
  | WorkspaceParam

// export const DEFAULT_FILTERS: DefaulQueryTypes = {
//   eventType: EVENT_TYPES.encounter,
//   tab: 'carriers',
//   graph: null,
//   after: '2017-01-01T00:00:00.000Z',
//   before: '2018-12-31T00:00:00.000Z',
//   vessel: null,
//   vesselLabel: null,
//   flag: null,
//   rfmo: null,
//   eez: null,
//   port: null,
//   timestamp: null,
//   layer: ['cp_rfmo'],
//   zoom: 2,
//   lat: -3,
//   lng: 29,
//   dataset: null,
//   'access-token': undefined,
// }


const getLocation = (state: any) => state.location

const getLocationQuery = createSelector([getLocation], (location) => {
  return location.query
})

const getQueryParam = (param: QueryParam) =>
  createSelector([getLocationQuery], (query: any) => {
    // if (query === undefined || query[param] === undefined) {
    //   return DEFAULT_FILTERS[param]
    // }
    return query[param]
  })

export const getDataviews = getQueryParam('dataviews')
