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
        id: 'c91e63157-7e49-8387-e4ff-8bc6f44ede1d',
        binary: true,
        color: '#00c1e7',
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
        id: 'd7b7d7901-12a5-d265-38fa-31b348928055',
        binary: true,
        color: '#f59e84',
      },
      dataview: {
        id: 'trackFishing',
        config: {
          type: TYPES.TRACK,
        },
        datasetsIds: ['carrierPortalVesselTrack'],
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
  'datasets?ids=carrierPortalVesselTrack': datasetsMock,
  'track?vesselId=1': trackCarrier,
  'track?vesselId=2': carrierVesselMock,
}
