import { Workspace, Dataview, Dataset } from './types/dataviews-client'
import { TYPES } from "@globalfishingwatch/layer-composer";

export const DEFAULT_WORKSPACE:Workspace = {
  dataviewsWorkspace: [
    {
      id: 'background',
      dataview: {
        id: 'background',
        config: {
          id: 'background',
          type: TYPES.BACKGROUND,
        }
      },
      overrides: {}
    },
    {
      id: 'landmass',
      dataview: {
        id: 'landmass',
        config: {
          id: 'landmass',
          type: TYPES.BASEMAP,
        }
      }
    }
  ],
  zoom: 3,
  latitude: 0,
  longitude: 0
}


const getDatasetsMock:Dataset[] = [{
  endpoints: [{
    type: 'track',
    urlTemplate: 'track'
  }]
}]

const getDataviewsMock:Dataview[] = [
  {
    id: 'carrierReeferTrack',
    config: {},
    datasets: getDatasetsMock
  }
]

export const mockFetches:any = {
  'dataviews?ids=carrierReeferTrack,carrierVesselTrack': getDataviewsMock,
  'datasets?ids=carrierVessel': getDatasetsMock,
  // TODO
  'track?vesselId=1': {},
  'track?vesselId=2': {}
}