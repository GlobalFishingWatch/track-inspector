import { createSelector } from '@reduxjs/toolkit'
import { Type, TrackGeneratorConfig } from '@globalfishingwatch/layer-composer'
import { selectDataviews } from 'features/dataviews/dataviews.slice'
import { Vessel, selectVessels } from './vessels.slice'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'

export type VesselWithConfig = Partial<Vessel & TrackGeneratorConfig>

export const selectVesselsWithConfig = createSelector(
  [selectDataviews, selectVessels],
  (dataviewWorkspaces, vessels) => {
    const trackDataviewWorkspaces = dataviewWorkspaces.filter(
      (dataviewWorkspace: DataviewWorkspace) => {
        return dataviewWorkspace.dataview && dataviewWorkspace.dataview.config.type === Type.Track
      }
    )
    return trackDataviewWorkspaces.map((dataviewWorkspace: DataviewWorkspace) => {
      const config: TrackGeneratorConfig = dataviewWorkspace.dataview?.config
      let vessel: VesselWithConfig = {
        id: config.id,
        ...config,
      }
      if (config.datasetParamsId) {
        const vesselInfo = vessels[config.datasetParamsId]
        if (vesselInfo) {
          vessel = { ...vessel, ...vesselInfo }
        }
      }
      return vessel as VesselWithConfig
    })
  }
)
