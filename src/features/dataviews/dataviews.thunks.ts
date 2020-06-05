import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import GFWAPI from '@globalfishingwatch/api-client'
import DataviewsClient from '@globalfishingwatch/dataviews-client'
import { vessels } from '@globalfishingwatch/pbf/decoders/vessels'

import { mockFetches, DEFAULT_WORKSPACE, TRACK_FIELDS } from 'config'
import { selectDataviewsQuery } from 'routes/routes.selectors'
import { setVessel, setVesselTrack, setVesselEvents } from 'features/vessels/vessels.slice'
import trackValueArrayToSegments from 'data-transform/trackValueArrayToSegments'

import { setDataviews } from './dataviews.slice'

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
    }, 1)
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
    const dataviewsWorkspace = await dataviewsClient.load(dataviewsQuery)
    // dispatch(completeLoading({ id: 'dataviews' }))
    // console.log(dataviews)
    if (dataviewsWorkspace === null) {
      console.log('no updates, dont trigger any action')
    } else {
      console.log('received this from dataviews-client:', dataviewsWorkspace)

      // update layer composer
      dispatch(setDataviews(dataviewsWorkspace))

      const loadDataPromises = dataviewsClient.loadData()
      loadDataPromises.forEach((promise) => {
        promise.then(({ endpoint, dataviewWorkspace }) => {
          console.log('Loaded endpoint data:', endpoint, dataviewWorkspace)
          if (endpoint.type === 'track') {
            promise
              .then(({ response }) => response)
              .then((r) => r.arrayBuffer())
              .then((buffer) => {
                const track = vessels.Track.decode(new Uint8Array(buffer))
                return track.data
              })
              .then((valuesArray) => {
                const segments = trackValueArrayToSegments(valuesArray, TRACK_FIELDS)
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
    }
  }
}
