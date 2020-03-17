import { Workspace, Dataview, Dataset } from '@globalfishingwatch/api-client'
import { TYPES } from '@globalfishingwatch/layer-composer'
import track1 from './track1.json'
import track2 from './track2.json'

export const DEFAULT_WORKSPACE: Workspace = {
  dataviewsWorkspace: [
    {
      id: 'background',
      dataview: {
        id: 'background',
        config: {
          type: TYPES.BACKGROUND,
        },
      },
    },
    {
      id: 'landmass',
      dataview: {
        id: 'landmass',
        config: {
          type: TYPES.BASEMAP,
        },
      },
    },
    {
      id: 'trackCarrier',
      overrides: {
        id: '46df37738-8057-e7d4-f3f3-a9b44d52fe03',
        binary: true,
        color: '#00c1e7',
        // visible: false,
      },
      dataview: {
        id: 'trackCarrier',
        config: {
          type: TYPES.TRACK,
        },
        datasetsIds: ['carrierPortalVesselTrack'],
      },
    },
    {
      id: 'trackFishing',
      overrides: {
        id: 'c723c1925-56f9-465c-bee8-bcc6d649c17c',
        binary: true,
        color: '#f59e84',
        // visible: false,
      },
      dataview: {
        id: 'trackFishing',
        config: {
          type: TYPES.TRACK,
        },
        datasetsIds: ['carrierPortalVesselTrack'],
      },
    },
    {
      id: 'carrierEvents',
      overrides: {
        id: '46df37738-8057-e7d4-f3f3-a9b44d52fe03',
        // visible: false,
      },
      dataview: {
        id: 'carrierEvents',
        config: {
          type: TYPES.VESSEL_EVENTS,
        },
        datasetsIds: ['carrierPortalVesselEvents'],
      },
    },
  ],
  zoom: 3,
  latitude: 0,
  longitude: 0,
  start: '2019-01-01T00:00:00.000Z',
  end: '2020-01-01T00:00:00.000Z',
}

const datasetsMock: Dataset[] = [
  {
    id: 'carrierPortalVesselTrack',
    endpoints: [
      {
        type: 'track',
        urlTemplate:
          '/datasets/carriers:dev/vessels/{{id}}/tracks?startDate=2017-01-01T00:00:00.000Z&endDate=2019-09-30T00:00:00.000Z&binary={{binary}}&features=fishing,speed,course',
      },
    ],
  },
  {
    id: 'carrierPortalVesselEvents',
    endpoints: [
      {
        type: 'track',
        urlTemplate:
          '/datasets/carriers:dev/events?vessels={{id}}&startDate=2017-01-01T00%3A00%3A00.000Z&endDate=2019-09-30T00%3A00%3A00.000Z&timeFormat=timestamp&sortOrder=desc',
      },
    ],
  },
]

const dataviewsMock: Dataview[] = [
  {
    id: 'background',
    config: {
      type: TYPES.BACKGROUND,
    },
  },
  {
    id: 'landmass',
    config: {
      type: TYPES.BASEMAP,
    },
  },
  {
    id: 'trackCarrier',
    config: {
      type: TYPES.TRACK,
      color: '#00c1e7',
    },
    datasets: datasetsMock,
  },
  {
    id: 'trackFishing',
    config: {
      type: TYPES.TRACK,
      color: '#f59e84',
    },
    datasets: datasetsMock,
  },
]

const trackCarrier = track1

const carrierVesselMock = track2

export const mockFetches: any = {
  'dataviews?ids=background,landmass,trackCarrier,trackFishing': dataviewsMock,
  'datasets?ids=carrierPortalVesselTrack,carrierPortalVesselEvents': datasetsMock,
  'track?vesselId=1': trackCarrier,
  'track?vesselId=2': carrierVesselMock,
}
