import { Dataset } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { Field } from 'data-transform/trackValueArrayToSegments'
import { Dictionary, AppState, TimebarMode } from './types'

export const EVENTS_COLORS: Dictionary<string> = {
  encounterauthorized: '#FAE9A0',
  encounterauthorizedLabels: '#DCC76D',
  encounterpartially: '#F59E84',
  encounterunmatched: '#CE2C54',
  loitering: '#cfa9f9',
  port: '#99EEFF',
}

export const TRACK_START = new Date('2017-01-01T00:00:00.000Z')
export const TRACK_END = new Date('2020-05-01T00:00:00.000Z')
export const TRACK_FIELDS = [Field.lonlat, Field.timestamp, Field.speed]

export const CARRIER_PORTAL_URL = process.env.REACT_APP_CARRIER_PORTAL_URL

export const DEFAULT_WORKSPACE: AppState = {
  dataviewsWorkspace: [
    {
      id: 'background',
      dataview: {
        id: 'background',
        config: {
          type: Generators.Type.Background,
        },
      },
    },
    {
      id: 'landmass',
      dataview: {
        id: 'landmass',
        config: {
          type: Generators.Type.Basemap,
        },
      },
    },
    {
      id: 'ais',
      overrides: {},
      datasetParams: {
        dataset: 'fishing',
        id: '0000310d2-208e-fd8b-2e59-5619ec0cd497',
        binary: true,
        format: 'valueArray',
      },
      dataview: {
        id: 'ais',
        datasetsIds: ['carrierPortalVesselTrack'],
        config: {
          type: Generators.Type.Track,
          color: '#00c1e7',
          simplify: false,
        },
      },
    },
    {
      id: 'trackCarrier',
      overrides: {
        // visible: false,
      },
      datasetParams: {
        dataset: 'carriers:dev',
        id: '46df37738-8057-e7d4-f3f3-a9b44d52fe03',
        binary: true,
        format: 'valueArray',
      },
      dataview: {
        id: 'trackCarrier',
        datasetsIds: ['carrierPortalVesselTrack'],
        config: {
          type: Generators.Type.Track,
          color: '#00c1e7',
          simplify: true,
        },
      },
    },
    {
      id: 'trackFishing',
      overrides: {
        // visible: false,
      },
      datasetParams: {
        dataset: 'carriers:dev',
        id: 'c723c1925-56f9-465c-bee8-bcc6d649c17c',
        binary: true,
        format: 'valueArray',
      },
      dataview: {
        id: 'trackFishing',
        datasetsIds: ['carrierPortalVesselTrack'],
        config: {
          type: Generators.Type.Track,
          color: '#f59e84',
          simplify: true,
        },
      },
    },
    {
      id: 'carrierEvents',
      overrides: {
        // visible: false,
      },
      datasetParams: {
        dataset: 'carriers:dev',
        id: '46df37738-8057-e7d4-f3f3-a9b44d52fe03',
      },
      dataview: {
        id: 'carrierEvents',
        datasetsIds: ['carrierPortalVesselEvents'],
        config: {
          type: Generators.Type.VesselEvents,
        },
      },
    },
    {
      id: 'fishingEvents',
      overrides: {
        // visible: false,
      },
      datasetParams: {
        dataset: 'carriers:dev',
        id: 'c723c1925-56f9-465c-bee8-bcc6d649c17c',
      },
      dataview: {
        id: 'fishingEvents',
        datasetsIds: ['carrierPortalVesselEvents'],
        config: {
          type: Generators.Type.VesselEvents,
        },
      },
    },
    {
      id: 'cp_rfmo',
      overrides: {
        visible: false,
      },
      dataview: {
        id: 'cp_rfmo',
        name: 'Tuna RFMO areas',
        description:
          'RFMO stands for Regional Fishery Management Organization. These organizations are international organizations formed by countries with a shared interest in managing or conserving an area’s fish stock. Source: GFW',
        config: {
          type: Generators.Type.CartoPolygons,
          color: '#6b67e5',
        },
      },
    },
    {
      id: 'other_rfmos',
      overrides: {
        visible: false,
      },
      dataview: {
        id: 'other_rfmos',
        name: 'Other RFMO areas',
        description:
          'Geographic Area of Competence of South Pacific RFMO, Convention on Conservation of Antarctic Marine Living Resources, North-East Atlantic Fisheries Commission, Northwest Atlantic Fisheries Organization, South-East Atlantic Fisheries Organization, South Indian Ocean Fisheries Agreement, and General Fisheries Commission for the Mediterranean. Source: fao.org/geonetwork',
        config: {
          type: Generators.Type.CartoPolygons,
          color: '#d8d454',
        },
      },
    },
    {
      id: 'eez',
      overrides: {
        visible: false,
      },
      dataview: {
        id: 'eez',
        name: 'Exclusive Economic Zones',
        description:
          'Exclusive Economic Zones (EEZ) are states’ sovereign waters, which extend 200 nautical miles from the coast. Source: marineregions.org',
        config: {
          type: Generators.Type.CartoPolygons,
          color: '#61cb96',
        },
      },
    },
    {
      id: 'mpant',
      overrides: {
        visible: false,
      },
      dataview: {
        id: 'mpant',
        name: 'Marine Protected Areas',
        description: 'Protected Planet WDPA',
        config: {
          type: Generators.Type.CartoPolygons,
          color: '#e5777c',
        },
      },
    },
    {
      id: 'bluefin_rfmo',
      overrides: {
        visible: false,
      },
      dataview: {
        id: 'bluefin_rfmo',
        name: 'Southern bluefin tuna range',
        description:
          'Prepared by GFW based on "The Current Status of International Fishery Stocks", 2018, Fisheries Agency and Japan Fisheries Research and Education Agency',
        config: {
          type: Generators.Type.CartoPolygons,
          color: '#A758FF',
        },
      },
    },
  ],
  zoom: 4,
  latitude: 20,
  longitude: 134,
  start: '2019-01-01T00:00:00.000Z',
  end: '2020-01-01T00:00:00.000Z',
  sidebar: true,
  timebarMode: TimebarMode.events,
  alwaysRequireAuth: true,
}

const datasetsEndpointMock: Dataset[] = [
  {
    id: 'carrierPortalVesselTrack',
    endpoints: [
      {
        type: 'track',
        urlTemplate: `/datasets/{{dataset}}/vessels/{{id}}/tracks?startDate=${TRACK_START.toISOString()}&endDate=${TRACK_END.toISOString()}&binary={{binary}}&fields=${TRACK_FIELDS}&format={{format}}&wrapLongitudes=false`,
      },
      {
        type: 'info',
        urlTemplate: '/datasets/{{dataset}}/vessels/{{id}}',
      },
    ],
  },
  {
    id: 'carrierPortalVesselEvents',
    endpoints: [
      {
        type: 'events',
        urlTemplate: `/datasets/{{dataset}}/events?vessels={{id}}&startDate=${TRACK_START.toISOString()}&endDate=${TRACK_END.toISOString()}&timeFormat=timestamp&sortOrder=desc`,
      },
    ],
  },
]

export const mockFetches: any = {
  '/datasets?ids=fishing': datasetsEndpointMock,
  '/datasets?ids=carrierPortalVesselTrack': datasetsEndpointMock,
  '/datasets?ids=carrierPortalVesselTrack,carrierPortalVesselEvents': datasetsEndpointMock,
  '/datasets?ids=fishing,carrierPortalVesselTrack,carrierPortalVesselEvents': datasetsEndpointMock,
}
