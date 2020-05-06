import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import GFWAPI, { DataviewsClient } from '@globalfishingwatch/api-client'
import { mockFetches, DATAVIEW_LIBRARY } from 'config'
import { Field } from 'data-transform/trackValueArrayToSegments'
import { selectDataviewsQuery } from 'routes/routes.selectors'
import { setVessel, setVesselTrack, setVesselEvents } from 'features/vessels/vessels.slice'
import { startLoading, completeLoading } from 'features/loaders/loaders.slice'
import { setDataviews } from './dataviews.slice'
import decodeProtobuf from 'data-transform/decodeProtobuf'
import trackValueArrayToSegments from 'data-transform/trackValueArrayToSegments'

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
const dataviewsClient = new DataviewsClient(/*GFWAPI.fetch*/ mockFetch, DATAVIEW_LIBRARY)

export const dataviewsThunk = async (dispatch: Dispatch, getState: StateGetter<any>) => {
  const state = getState()
  const dataviewsQuery = selectDataviewsQuery(state)

  console.log(dataviewsQuery)

  if (dataviewsQuery) {
    // TODO: better handle of loading when no new dataviews to load, removing for now to avoid unnecesary rerenders
    // dispatch(startLoading({ id: 'dataviews', areas: ['map', 'timebar'] }))
    const dataviewsWorkspace = await dataviewsClient.load(dataviewsQuery)
    // dispatch(completeLoading({ id: 'dataviews' }))

    if (dataviewsWorkspace === null) {
      console.log('no updates, dont trigger any action')
    } else {
      console.log('received this from dataviews-client:', dataviewsWorkspace)

      dispatch(setDataviews(dataviewsWorkspace))

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
                const valuesArray = decodeProtobuf(buffer)
                return valuesArray
              })
              .then((valuesArray) => {
                const segments = trackValueArrayToSegments(valuesArray, [
                  Field.lonlat,
                  Field.timestamp,
                ])
                console.log('track decoded', segments, dataviewWorkspace)
                dispatch(
                  setVesselTrack({
                    id: dataviewWorkspace.datasetParams.id as string,
                    data: segments,
                  })
                )
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
