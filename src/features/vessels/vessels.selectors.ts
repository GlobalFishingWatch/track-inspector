import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectResources } from 'features/dataviews/resources.slice'
import { selectResolvedDataviews } from 'features/dataviews/dataviews.selectors'

export type VesselDynamicField = {
  start: string
  end: string
  value: string
}
export type Vessel = {
  id: string
  name: string
  imo?: string
  flags?: VesselDynamicField[]
  lastFlag?: string
  mmsi?: VesselDynamicField[]
  lastMMSI?: string
}

export const selectVesselsInfo = createSelector(
  [selectResolvedDataviews, selectResources],
  (resolvedDataviews, resources) => {
    const vesselsInfo = resolvedDataviews
      .filter(
        (dataview) =>
          dataview.view?.type === Generators.Type.Track && dataview.view?.visible !== 'false'
      )
      .map((dataview) => {
        const vesselResource = resources.find(
          (resource) =>
            resource.type === 'info' && resource.datasetParamId === dataview.datasetsParamIds[0]
        )
        const trackResource = resources.find(
          (resource) =>
            resource.type === 'track' && resource.datasetParamId === dataview.datasetsParamIds[0]
        )
        return {
          dataview,
          data: (vesselResource?.data as Vessel) || {},
          loaded: trackResource?.loaded,
        }
      })
    return vesselsInfo
  }
)
