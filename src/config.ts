import { Dataset, DataviewWorkspace } from '@globalfishingwatch/api-client'
import { Type } from '@globalfishingwatch/layer-composer'
import { Dictionary, AppState } from './types'
import { Field } from 'data-transform/trackValueArrayToSegments'

export const EVENTS_COLORS: Dictionary<string> = {
  encounterauthorized: '#FAE9A0',
  encounterpartially: '#F59E84',
  encounterunmatched: '#CE2C54',
  loitering: '#cfa9f9',
  port: '#99EEFF',
}

export const TRACK_START = new Date('2017-01-01T00:00:00.000Z')
export const TRACK_END = new Date('2020-01-01T00:00:00.000Z')

export const DEFAULT_WORKSPACE: AppState = {
  dataviewsWorkspace: [
    {
      id: 'background',
    },
    {
      id: 'landmass',
    },
    {
      id: 'trackCarrier',
    },
    {
      id: 'trackFishing',
    },
    {
      id: 'carrierEvents',
    },
    {
      id: 'cp_rfmo',
    },
  ],
  zoom: 4,
  latitude: 20,
  longitude: 134,
  start: '2019-01-01T00:00:00.000Z',
  end: '2020-01-01T00:00:00.000Z',
  sidebar: true,
}

export const DATAVIEW_LIBRARY: DataviewWorkspace[] = [
  {
    id: 'background',
    dataview: {
      id: 'background',
      config: {
        type: Type.Background,
      },
    },
  },
  {
    id: 'landmass',
    dataview: {
      id: 'landmass',
      config: {
        type: Type.Basemap,
      },
    },
  },
  {
    id: 'trackCarrier',
    datasetParams: {
      id: '46df37738-8057-e7d4-f3f3-a9b44d52fe03',
      binary: true,
      format: 'valueArray',
      fields: [Field.lonlat, Field.timestamp],
      startDate: TRACK_START.toISOString(),
      endDate: TRACK_END.toISOString(),
    },
    dataview: {
      id: 'trackCarrier',
      datasetsIds: ['carrierPortalVesselTrack'],
      config: {
        type: Type.Track,
        color: '#00c1e7',
        simplify: true,
      },
    },
  },
  {
    id: 'speedGraphCarrier',
    datasetParams: {
      id: '46df37738-8057-e7d4-f3f3-a9b44d52fe03',
      binary: true,
      format: 'valueArray',
      fields: [Field.speed],
      startDate: TRACK_START.toISOString(),
      endDate: TRACK_END.toISOString(),
    },
    dataview: {
      id: 'speedGraphCarrier',
      datasetsIds: ['carrierPortalVesselTrack'],
      config: {
        color: '#00c1e7',
      },
    },
  },
  {
    id: 'trackFishing',
    datasetParams: {
      id: 'c723c1925-56f9-465c-bee8-bcc6d649c17c',
      binary: true,
      format: 'valueArray',
      fields: [Field.lonlat, Field.timestamp],
      startDate: TRACK_START.toISOString(),
      endDate: TRACK_END.toISOString(),
    },
    dataview: {
      id: 'trackFishing',
      datasetsIds: ['carrierPortalVesselTrack'],
      config: {
        type: Type.Track,
        color: '#f59e84',
        simplify: true,
      },
    },
  },
  {
    id: 'speedGraphFishing',
    datasetParams: {
      id: 'c723c1925-56f9-465c-bee8-bcc6d649c17c',
      binary: true,
      format: 'valueArray',
      fields: [Field.speed],
      startDate: TRACK_START.toISOString(),
      endDate: TRACK_END.toISOString(),
    },
    dataview: {
      id: 'speedGraphFishing',
      datasetsIds: ['carrierPortalVesselTrack'],
      config: {
        color: '#f59e84',
      },
    },
  },
  {
    id: 'carrierEvents',
    datasetParams: {
      id: '46df37738-8057-e7d4-f3f3-a9b44d52fe03',
      startDate: TRACK_START.toISOString(),
      endDate: TRACK_END.toISOString(),
    },
    dataview: {
      id: 'carrierEvents',
      datasetsIds: ['carrierPortalVesselEvents'],
      config: {
        type: Type.VesselEvents,
      },
    },
  },
  {
    id: 'cp_rfmo',
    dataview: {
      id: 'cp_rfmo',
      name: 'Tuna RFMO areas',
      description:
        'RFMO stands for Regional Fishery Management Organization. These organizations are international organizations formed by countries with a shared interest in managing or conserving an area’s fish stock. Source: GFW',
      config: {
        type: Type.CartoPolygons,
        color: '#58CFFF',
      },
    },
  },
  {
    id: 'sprfmo',
    dataview: {
      id: 'sprfmo',
      name: 'SPRFMO area',
      description:
        'Geographic Area of Competence of South Pacific Regional Fisheries Management Organisation. Source: fao.org/geonetwork',
      config: {
        type: Type.CartoPolygons,
        color: '#d8d454',
      },
    },
  },
  {
    id: 'eez',
    dataview: {
      id: 'eez',
      name: 'Exclusive Economic Zones',
      description:
        'Exclusive Economic Zones (EEZ) are states’ sovereign waters, which extend 200 nautical miles from the coast. Source: marineregions.org',
      config: {
        type: Type.CartoPolygons,
        color: '#61cb96',
      },
    },
  },
  {
    id: 'mpant',
    dataview: {
      id: 'mpant',
      name: 'Marine Protected Areas',
      description: 'Protected Planet WDPA',
      config: {
        type: Type.CartoPolygons,
        color: '#e5777c',
      },
    },
  },
  {
    id: 'bluefin_rfmo',
    dataview: {
      id: 'bluefin_rfmo',
      name: 'Southern bluefin tuna range',
      description:
        'Prepared by GFW based on "The Current Status of International Fishery Stocks", 2018, Fisheries Agency and Japan Fisheries Research and Education Agency',
      config: {
        type: Type.CartoPolygons,
        color: '#A758FF',
      },
    },
  },
]

const datasetsEndpointMock: Dataset[] = [
  {
    id: 'carrierPortalVesselTrack',
    endpoints: [
      {
        type: 'track',
        urlTemplate: `/datasets/carriers:dev/vessels/{{id}}/tracks?startDate={{startDate}}&endDate={{endDate}}&binary={{binary}}&fields={{fields}}&format={{format}}`,
      },
      {
        type: 'info',
        urlTemplate: '/datasets/carriers:dev/vessels/{{id}}',
      },
    ],
  },
  {
    id: 'carrierPortalVesselEvents',
    endpoints: [
      {
        type: 'events',
        urlTemplate: `/datasets/carriers:dev/events?vessels={{id}}&startDate={{startDate}}&endDate={{endDate}}&timeFormat=timestamp&sortOrder=desc`,
      },
    ],
  },
]

export const mockFetches: any = {
  'datasets?ids=carrierPortalVesselTrack,carrierPortalVesselEvents': datasetsEndpointMock,
}
