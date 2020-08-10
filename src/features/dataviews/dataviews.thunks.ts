import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import GFWAPI from '@globalfishingwatch/api-client'
import DataviewsClient from '@globalfishingwatch/dataviews-client'
import { vessels } from '@globalfishingwatch/pbf/decoders/vessels'
import { TEST_WORKSPACE, TRACK_FIELDS, mockTestFetches } from 'config'
import { selectDataviewsQuery, selectFishingPositionsQuery } from 'routes/routes.selectors'
import { setVesselTrack, setVesselEvents } from 'features/vessels/vessels.slice'
import trackValueArrayToSegments, { Segment } from 'data-transform/trackValueArrayToSegments'
import { setDataviews } from './dataviews.slice'

const mockFetch = (mockFetchUrl: string) => {
  const mock = mockTestFetches[mockFetchUrl]
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

const defEvent = {
  id: 'b5ca2a96482bd40ecebbb23893372436',
  type: 'encounter',
  vessel: {
    id: '00ba29183-3b86-9e36-cf20-ee340e409521',
    flag: 'RUS',
    name: 'ANASTASIYA',
    ssvid: '273825520',
    nextPort: null,
  },
  start: 1573510011000,
  end: 1573727898000,
  position: { lat: 43.0180133333, lon: 132.016463333 },
  rfmos: [],
  eezs: ['5690'],
}

// TODO use GFWAPI for real fetches
const dataviewsClient = new DataviewsClient(
  /*GFWAPI.fetch*/ mockFetch,
  TEST_WORKSPACE.dataviewsWorkspace
)
let globalPoints: any[] = []
let dataviewId: string
let lastLen: number

export const dataviewsThunk = async (dispatch: Dispatch, getState: StateGetter<any>) => {
  const state = getState()
  const dataviewsQuery = selectDataviewsQuery(state)
  const len = parseInt(selectFishingPositionsQuery(state))

  const refreshPoints = () => {
    if (lastLen === len) {
      return
    }
    lastLen = len
    const data = globalPoints.flatMap((segment: Segment) => {
      const segLen = segment.length
      let count = 0
      const events = segment.map((event, index: number) => {
        if (event.fishing !== 0 && (!len || count < len)) {
          count++
          return {
            ...defEvent,
            ...{
              type: 'encounter',
              start: event.timestamp,
              end: event.timestamp,
              position: { lat: event.latitude, lon: event.longitude },
            },
          }
        }
      })
      return events.filter((event: any) => event)
    })

    console.error(len, globalPoints, data, '-----------------')
    dispatch(setVesselEvents({ id: dataviewId, data }))
  }

  if (dataviewsQuery) {
    const dataviewsWorkspace = await dataviewsClient.load(dataviewsQuery)
    // dispatch(completeLoading({ id: 'dataviews' }))
    // console.log(dataviews)
    if (globalPoints && globalPoints.length) {
      refreshPoints()
    }
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
            /*promise
              .then(({ response }) => response.json())
              .then((data) => {
                dispatch(setVessel(data))
              })*/
          } else if (endpoint.type === 'events') {
            promise
              .then(({ response }) => response)
              .then((r) => r.arrayBuffer())
              .then((buffer) => {
                const track = vessels.Track.decode(new Uint8Array(buffer))
                return track.data
              })
              .then((valuesArray) => {
                globalPoints = trackValueArrayToSegments(valuesArray, TRACK_FIELDS)
                dataviewId = dataviewWorkspace.datasetParams.id
                refreshPoints()
              })
          }
        })
      })
    }
  }
}
