import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import geobuf from 'geobuf'
import Pbf from 'pbf'
import GFWAPI, { DataviewsClient, Dataview } from '@globalfishingwatch/api-client'
import { Type } from '@globalfishingwatch/layer-composer'
import { mockFetches, DEFAULT_WORKSPACE } from '../constants'
import { getDataviewsQuery } from './route.selectors'
import { updateMapLayers } from './map.actions'
import { setVesselTrack, setVesselEvents } from './vessels.actions'
import { startLoading, completeLoading } from './loaders.actions'

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
  const dataviewsQuery = getDataviewsQuery(state)

  if (dataviewsQuery) {
    // TODO: better handle of loading when no new dataviews to load, removing for now to avoid unnecesary rerenders
    // dispatch(startLoading({ id: 'dataviews', areas: ['map', 'timebar'] }))
    const dataviews = await dataviewsClient.load(dataviewsQuery)
    // dispatch(completeLoading({ id: 'dataviews' }))
    // console.log(dataviews)
    if (dataviews === null) {
      console.log('no updates, dont trigger any action')
    } else {
      console.log('received this from dataviews-client:', dataviews)
      // update layer composer
      const generatorConfigs = dataviews.map((dataview: Dataview) => dataview.config)
      dispatch(updateMapLayers(generatorConfigs))

      dispatch(startLoading({ id: 'dataviews-data', areas: ['map', 'timebar'] }))
      const loadDataPromises = dataviewsClient.loadData()
      loadDataPromises.forEach((promise) => {
        promise.then(({ data, dataview }) => {
          console.log('Loaded endpoint data:', data, dataview)
          if (dataview.config.type === Type.Track) {
            promise
              .then(({ response }) => response)
              .then((r) => r.arrayBuffer())
              .then((buffer) => {
                const protobuf = new Pbf(buffer)
                return geobuf.decode(protobuf)
              })
              .then((data) => {
                try {
                  dispatch(setVesselTrack({ id: dataview.id, data }))
                } catch (e) {
                  console.error(e)
                }
              })
          } else if (dataview.config.type === Type.VesselEvents) {
            promise
              .then(({ response }) => response.json())
              .then((data) => {
                dispatch(setVesselEvents({ id: dataview.id, data }))
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
