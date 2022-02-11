import { Dataset, Dataview } from '@globalfishingwatch/dataviews-client'
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
  pending: '#AFBBCA',
}

export const TRACK_START = new Date('2017-01-01T00:00:00.000Z')
export const TRACK_END = new Date()
export const TRACK_FIELDS = [Field.lonlat, Field.timestamp, Field.speed]

export const CARRIER_PORTAL_URL = process.env.REACT_APP_CARRIER_PORTAL_URL

export const DEFAULT_WORKSPACE: AppState = {
  workspaceDataviews: [
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
      id: 'eventsCarrier',
    },
    {
      id: 'cp_rfmo',
    },
    {
      id: 'other_rfmos',
      view: {
        visible: false,
      },
    },
    {
      id: 'eez',
    },
    {
      id: 'mpant',
    },
    {
      id: 'bluefin_rfmo',
    },
  ],
  zoom: 3,
  latitude: 51,
  longitude: 155,
  start: '2019-01-01T00:00:00.000Z',
  end: '2020-01-01T00:00:00.000Z',
  sidebar: true,
  timebarMode: TimebarMode.events,
}

const DATASET: Dataset = {
  // TODO move this to .env variable
  id: 'carriers:latest',
  endpoints: [
    {
      type: 'track',
      downloadable: true,
      urlTemplate: `/datasets/{{dataset}}/vessels/{{id}}/tracks?startDate=${TRACK_START.toISOString()}&endDate=${TRACK_END.toISOString()}&binary={{binary}}&fields=${TRACK_FIELDS}&format={{format}}&wrapLongitudes=false`,
    },
    {
      type: 'info',
      downloadable: true,
      urlTemplate: '/datasets/{{dataset}}/vessels/{{id}}',
    },
    {
      type: 'events',
      downloadable: true,
      urlTemplate: `/datasets/{{dataset}}/events?vessels={{id}}&startDate=${TRACK_START.toISOString()}&endDate=${TRACK_END.toISOString()}&timeFormat=timestamp&sortOrder=desc`,
    },
  ],
}

export const DEFAULT_DATAVIEWS: Dataview[] = [
  {
    id: 'background',
    name: 'background',
    description: 'background',
    defaultView: {
      type: Generators.Type.Background,
    },
  },
  {
    id: 'landmass',
    name: 'landmass',
    description: 'landmass',
    defaultView: {
      type: Generators.Type.Basemap,
      basemap: 'landmass',
    },
  },
  {
    id: 'trackCarrier',
    name: 'Carrier track',
    description: 'Carrier track',
    defaultDatasetsParams: [
      {
        dataset: 'carriers:dev',
        id: '46df37738-8057-e7d4-f3f3-a9b44d52fe03',
        binary: true,
        format: 'valueArray',
      },
    ],
    defaultView: {
      type: Generators.Type.Track,
      color: '#00c1e7',
      simplify: true,
    },
    datasets: [DATASET],
  },
  {
    id: 'trackFishing',
    name: 'Fishing track',
    description: 'Fishing track',
    defaultDatasetsParams: [
      {
        dataset: 'carriers:dev',
        id: 'c723c1925-56f9-465c-bee8-bcc6d649c17c',
        binary: true,
        format: 'valueArray',
      },
    ],
    defaultView: {
      type: Generators.Type.Track,
      color: '#f59e84',
      simplify: true,
    },
    datasets: [DATASET],
  },
  {
    id: 'eventsCarrier',
    name: 'Carrier events',
    description: 'Carrier events',
    defaultDatasetsParams: [
      {
        dataset: 'carriers:dev',
        id: '46df37738-8057-e7d4-f3f3-a9b44d52fe03',
      },
    ],
    defaultView: {
      type: Generators.Type.VesselEvents,
    },
    datasets: [DATASET],
  },
  {
    id: 'eventsFishing',
    name: 'Fishing events',
    description: 'Fishing events',
    defaultDatasetsParams: [
      {
        dataset: 'carriers:dev',
        id: 'c723c1925-56f9-465c-bee8-bcc6d649c17c',
      },
    ],
    defaultView: {
      type: Generators.Type.VesselEvents,
    },
    datasets: [DATASET],
  },
  {
    id: 'cp_rfmo',
    name: 'Tuna RFMO areas',
    description:
      'RFMO stands for Regional Fishery Management Organization. These organizations are international organizations formed by countries with a shared interest in managing or conserving an area’s fish stock. Source: GFW',
    defaultView: {
      type: Generators.Type.CartoPolygons,
      cartoTableId: 'cp_rfmo',
      color: '#6b67e5',
    },
  },
  {
    id: 'other_rfmos',
    name: 'Other RFMO areas',
    description:
      'Geographic Area of Competence of South Pacific RFMO, Convention on Conservation of Antarctic Marine Living Resources, North-East Atlantic Fisheries Commission, Northwest Atlantic Fisheries Organization, South-East Atlantic Fisheries Organization, South Indian Ocean Fisheries Agreement, and General Fisheries Commission for the Mediterranean. Source: fao.org/geonetwork',
    defaultView: {
      type: Generators.Type.CartoPolygons,
      cartoTableId: 'other_rfmos',
      color: '#d8d454',
    },
  },
  {
    id: 'eez',
    name: 'Exclusive Economic Zones',
    description:
      'Exclusive Economic Zones (EEZ) are states’ sovereign waters, which extend 200 nautical miles from the coast. Source: marineregions.org',
    defaultView: {
      type: Generators.Type.CartoPolygons,
      cartoTableId: 'eez',
      color: '#61cb96',
    },
  },
  {
    id: 'mpant',
    name: 'Marine Protected Areas',
    description: 'Protected Planet WDPA',
    defaultView: {
      type: Generators.Type.CartoPolygons,
      cartoTableId: 'mpant',
      color: '#e5777c',
    },
  },
  {
    id: 'bluefin_rfmo',
    name: 'Southern bluefin tuna range',
    description:
      'Prepared by GFW based on "The Current Status of International Fishery Stocks", 2018, Fisheries Agency and Japan Fisheries Research and Education Agency',
    defaultView: {
      type: Generators.Type.CartoPolygons,
      cartoTableId: 'bluefin_rfmo',
      color: '#A758FF',
    },
  },
]
