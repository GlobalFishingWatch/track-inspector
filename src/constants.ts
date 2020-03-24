import { Workspace, Dataset } from '@globalfishingwatch/api-client'
import { TYPES } from '@globalfishingwatch/layer-composer'

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
        // visible: false,
      },
      dataview: {
        id: 'trackCarrier',
        datasetsIds: ['carrierPortalVesselTrack'],
        config: {
          type: TYPES.TRACK,
          color: '#00c1e7',
        },
      },
    },
    {
      id: 'trackFishing',
      overrides: {
        id: 'c723c1925-56f9-465c-bee8-bcc6d649c17c',
        binary: true,
        // visible: false,
      },
      dataview: {
        id: 'trackFishing',
        datasetsIds: ['carrierPortalVesselTrack'],
        config: {
          type: TYPES.TRACK,
          color: '#f59e84',
        },
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
        datasetsIds: ['carrierPortalVesselEvents'],
        config: {
          type: TYPES.VESSEL_EVENTS,
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
          type: TYPES.CARTO_POLYGONS,
          color: '#58CFFF',
        },
      },
    },
    {
      id: 'sprfmo',
      overrides: {
        visible: false,
      },
      dataview: {
        id: 'sprfmo',
        name: 'SPRFMO area',
        description:
          'Geographic Area of Competence of South Pacific Regional Fisheries Management Organisation. Source: fao.org/geonetwork',
        config: {
          type: TYPES.CARTO_POLYGONS,
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
          type: TYPES.CARTO_POLYGONS,
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
          type: TYPES.CARTO_POLYGONS,
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
          type: TYPES.CARTO_POLYGONS,
          color: '#A758FF',
        },
      },
    },
  ],
  zoom: 3,
  latitude: 20,
  longitude: 134,
  start: '2019-01-01T00:00:00.000Z',
  end: '2020-01-01T00:00:00.000Z',
}

const datasetsEndpointMock: Dataset[] = [
  {
    id: 'carrierPortalVesselTrack',
    endpoints: [
      {
        type: 'track',
        urlTemplate:
          '/datasets/carriers:dev/vessels/{{id}}/tracks?startDate=2017-01-01T00:00:00.000Z&endDate=2019-09-30T00:00:00.000Z&binary={{binary}}&features=speed,course',
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

export const mockFetches: any = {
  'datasets?ids=carrierPortalVesselTrack,carrierPortalVesselEvents': datasetsEndpointMock,
}
