import { Workspace, Dataview, Dataset } from '@globalfishingwatch/api-client'
import { TYPES } from '@globalfishingwatch/layer-composer';
import track1 from './track1.json'
import track2 from './track2.json'

export const DEFAULT_WORKSPACE:Workspace = {
  dataviewsWorkspace: [
    {
      id: 'background',
      dataview: {
        id: 'background',
        config: {
          type: TYPES.BACKGROUND,
        }
      },
    },
    {
      id: 'landmass',
      dataview: {
        id: 'landmass',
        config: {
          type: TYPES.BASEMAP,
        }
      }
    },
    {
      id: 'carrierReeferTrack',
      overrides: {
        id: '1'
      },
      dataview: {
        id: 'carrierReeferTrack',
        config: {
          type: TYPES.TRACK
        },
        datasetsIds: ['carrierPortalVessel']
      }
    },
    {
      id: 'carrierVesselTrack',
      overrides: {
        id: '2',
        color: '#ffff00',
      },
      dataview: {
        id: 'carrierVesselTrack',
        config: {
          type: TYPES.TRACK
        },
        datasetsIds: ['carrierPortalVessel']
      }
    }
  ],
  zoom: 3,
  latitude: 0,
  longitude: 0,
  start: '2019-01-01T00:00:00.000Z',
  end: '2020-01-01T00:00:00.000Z'
}


const datasetsMock:Dataset[] = [{
  id: 'carrierPortalVessel',
  endpoints: [{
    type: 'track',
    urlTemplate: 'track?vesselId={{id}}'
  }]
}]

const dataviewsMock:Dataview[] = [
  {
    id: 'background',
    config: {
      type: TYPES.BACKGROUND,
    }
  },
  {
    id: 'landmass',
    config: {
      type: TYPES.BASEMAP,
    }
  },
  {
    id: 'carrierReeferTrack',
    config: {
      type: TYPES.TRACK
    },
    datasets: datasetsMock
  },
  {
    id: 'carrierVesselTrack',
    config: {
      type: TYPES.TRACK,
      color: '#ff0000'
    },
    datasets: datasetsMock
  }
]

const carrierReeferTrack = track1

const carrierVesselMock = track2

export const mockFetches:any = {
  'dataviews?ids=background,landmass,carrierReeferTrack,carrierVesselTrack': dataviewsMock,
  'datasets?ids=carrierPortalVessel': datasetsMock,
  'track?vesselId=1': carrierReeferTrack,
  'track?vesselId=2': carrierVesselMock
}