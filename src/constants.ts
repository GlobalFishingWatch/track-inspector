import { Workspace, Dataview, Dataset } from '@globalfishingwatch/api-client'
import { TYPES } from "@globalfishingwatch/layer-composer";

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
        id: '2'
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
  longitude: 0
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

const carrierReeferTrack = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            -20.0390625,
            34.59704151614417
          ],
          [
            -10.1953125,
            51.83577752045248
          ]
        ]
      }
    }
  ]
}

const carrierVesselMock = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            -37.265625,
            38.54816542304656
          ],
          [
            -30.322265625000004,
            30.977609093348686
          ],
          [
            -19.951171875,
            40.111688665595956
          ],
          [
            -18.28125,
            48.516604348867475
          ],
          [
            -33.486328125,
            40.713955826286046
          ],
          [
            -29.003906249999996,
            37.3002752813443
          ]
        ]
      }
    }
  ]
}

export const mockFetches:any = {
  'dataviews?ids=background,landmass,carrierReeferTrack,carrierVesselTrack': dataviewsMock,
  'datasets?ids=carrierPortalVessel': datasetsMock,
  'track?vesselId=1': carrierReeferTrack,
  'track?vesselId=2': carrierVesselMock
}