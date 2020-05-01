import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import geobuf from 'geobuf'
import Pbf from 'pbf'
import GFWAPI, { DataviewsClient, DataviewWorkspace } from '@globalfishingwatch/api-client'
import { mockFetches, DEFAULT_WORKSPACE } from 'config'
import { selectDataviewsQuery } from 'routes/routes.selectors'
import { updateMapLayers } from 'features/map/map.actions'
import { setVessel, setVesselTrack, setVesselEvents } from 'features/vessels/vessels.slice'
import { startLoading, completeLoading } from 'features/loaders/loaders.slice'

const mockFetch = (mockFetchUrl: string) => {
  const mock = mockFetches[mockFetchUrl]
  if (!mock) {
    return GFWAPI.fetch(mockFetchUrl, { json: false })
  }
  console.log('For', mockFetchUrl, 'Found this mock:', mock)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        new Response(JSON.stringify(mock), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    }, Math.random() * 3000)
  })
}

// TODO use GFWAPI for real fetches
const dataviewsClient = new DataviewsClient(
  /*GFWAPI.fetch*/ mockFetch,
  DEFAULT_WORKSPACE.dataviewsWorkspace
)

export const dataviewsThunk = async (dispatch: Dispatch, getState: StateGetter<any>) => {
  const state = getState()
  const dataviewsQuery = selectDataviewsQuery(state)

  if (dataviewsQuery) {
    // TODO: better handle of loading when no new dataviews to load, removing for now to avoid unnecesary rerenders
    // dispatch(startLoading({ id: 'dataviews', areas: ['map', 'timebar'] }))
    const dataviewsWorkspace = await dataviewsClient.load(dataviewsQuery)
    // dispatch(completeLoading({ id: 'dataviews' }))
    // console.log(dataviews)
    if (dataviewsWorkspace === null) {
      console.log('no updates, dont trigger any action')
    } else {
      console.log('received this from dataviews-client:', dataviewsWorkspace)

      // update layer composer
      const generatorConfigs = dataviewsWorkspace.map((dataviewWorkspace: DataviewWorkspace) => {
        const dataviewConfig = dataviewWorkspace.dataview ? dataviewWorkspace.dataview.config : {}
        return {
          ...dataviewConfig,
          ...dataviewWorkspace.overrides,
          id: dataviewWorkspace.id,
          dataviewId: dataviewWorkspace.dataview && dataviewWorkspace.dataview.id,
          datasetParamsId: dataviewWorkspace.datasetParams.id,
        }
      })
      dispatch(updateMapLayers(generatorConfigs))

      dispatch(startLoading({ id: 'dataviews-data', areas: ['map', 'timebar'] }))
      const loadDataPromises = dataviewsClient.loadData()
      loadDataPromises.forEach((promise) => {
        promise.then(({ endpoint, dataviewWorkspace }) => {
          console.log('Loaded endpoint data:', endpoint, dataviewWorkspace)
          if (endpoint.type === 'track') {
            promise
              .then(({ response }) => response)
              .then((r) => r.arrayBuffer())
              .then((buffer) => {
                const protobuf = new Pbf(buffer)
                return geobuf.decode(protobuf)
              })
              .then((data) => {
                try {
                  dispatch(setVesselTrack({ id: dataviewWorkspace.datasetParams.id, data }))
                } catch (e) {
                  console.error(e)
                }
              })
          } else if (endpoint.type === 'info') {
            promise
              .then(({ response }) => response.json())
              .then((data) => {
                dispatch(setVessel(data))
              })
          } else if (endpoint.type === 'events') {
            promise
              .then(({ response }) => response.json())
              .then((data) => {
                dispatch(setVesselEvents({ id: dataviewWorkspace.datasetParams.id, data }))
              })
          }
        })
      })
      Promise.all(loadDataPromises).then(() => {
        dispatch(completeLoading({ id: 'dataviews-data' }))
      })
    }
  }
}
