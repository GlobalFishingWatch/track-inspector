import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import { DataviewsClient, Dataview } from '@globalfishingwatch/api-client'
import { TYPES } from "@globalfishingwatch/layer-composer";
import { mockFetches, DEFAULT_WORKSPACE } from '../constants'
import { getDataviewsQuery } from './route.selectors'
import { updateMapLayers } from './map.actions'
import { setVesselTrack } from './vessels.actions'


const mockFetch = (mockFetchUrl: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mock = mockFetches[mockFetchUrl]
      console.log('For',mockFetchUrl , 'Found this mock:', mock)
      resolve(mock)
    }, Math.random() * 3000)
  })
}

// TODO use GFWAPI for real fetches
const dataviewsClient = new DataviewsClient(/*GFWAPI.fetch*/ mockFetch, DEFAULT_WORKSPACE.dataviewsWorkspace)

export const dataviewsThunk = async (dispatch: Dispatch, getState: StateGetter<any>) => {
  const state = getState()
  const dataviewsQuery = getDataviewsQuery(state)
  if (dataviewsQuery) {
    console.log('dataviews query:', dataviewsQuery)
    const dataviews = await dataviewsClient.load(dataviewsQuery)
    console.log(dataviews)
    if (dataviews === null) {
      console.log('no updates, dont trigger any action')
    } else {
      console.log('received this from dataviews-client:', dataviews)
      // update layer composer
      const generatorConfigs = dataviews.map((dataview: Dataview) => dataview.config)
      dispatch(updateMapLayers(generatorConfigs))

      const loadDataPromises = dataviewsClient.loadData()
      loadDataPromises.forEach(async promise => {
        const {data, dataview} = await promise
        console.log('Loaded endpoint data:', data, dataview)
        if (dataview.config.type === TYPES.TRACK) {
          dispatch(setVesselTrack({ id: dataview.id, data }))
        }
      })
    }
  }
}