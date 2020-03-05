import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import geobuf from 'geobuf'
import Pbf from 'pbf'
import GFWAPI, { DataviewsClient, Dataview } from '@globalfishingwatch/api-client'
import { TYPES } from "@globalfishingwatch/layer-composer";
import { mockFetches, DEFAULT_WORKSPACE } from '../constants'
import { getDataviewsQuery } from './route.selectors'
import { updateMapLayers } from './map.actions'
import { setVesselTrack } from './vessels.actions'


const mockFetch = (mockFetchUrl: string) => {
  const mock = mockFetches[mockFetchUrl]
  if (!mock) {
    return GFWAPI.fetch(mockFetchUrl, { json: false })
  }
  console.log('For',mockFetchUrl , 'Found this mock:', mock)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(new Response(JSON.stringify(mock), { "status": 200, headers: { "Content-Type": "application/json" } }))
    }, Math.random() * 3000)
  })
}

// TODO use GFWAPI for real fetches
const dataviewsClient = new DataviewsClient(/*GFWAPI.fetch*/ mockFetch, DEFAULT_WORKSPACE.dataviewsWorkspace)

export const dataviewsThunk = async (dispatch: Dispatch, getState: StateGetter<any>) => {
  const state = getState()
  const dataviewsQuery = getDataviewsQuery(state)
  if (dataviewsQuery) {
    // console.log('dataviews query:', dataviewsQuery)
    const dataviews = await dataviewsClient.load(dataviewsQuery)
    // console.log(dataviews)
    if (dataviews === null) {
      console.log('no updates, dont trigger any action')
    } else {
      console.log('received this from dataviews-client:', dataviews)
      // update layer composer
      const generatorConfigs = dataviews.map((dataview: Dataview) => dataview.config)
      dispatch(updateMapLayers(generatorConfigs))

      const loadDataPromises = dataviewsClient.loadData()
      loadDataPromises.forEach(promise => {
        promise.then(({data, dataview}) => {
          console.log('Loaded endpoint data:', data, dataview)
          if (dataview.config.type === TYPES.TRACK) {
            promise
              .then(({ response }) => response)
              .then((r) => r.arrayBuffer())
              .then((buffer) => {
                const protobuf = new Pbf(buffer)
                return geobuf.decode(protobuf)
              })
              .then((data) => {
                console.log(data)
                dispatch(setVesselTrack({ id: dataview.id, data }))
              })
          }
        })
      })
    }
  }
}