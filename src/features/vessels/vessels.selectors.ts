import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectDataviews } from 'features/dataviews/dataviews.slice'
import { Vessel, selectVessels } from './vessels.slice'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'

export type VesselWithConfig = Partial<Vessel & Generators.TrackGeneratorConfig>

export const selectVesselsWithConfig = createSelector(
  [selectDataviews, selectVessels],
  (dataviewWorkspaces, vessels) => {
    const trackDataviewWorkspaces = dataviewWorkspaces.filter(
      (dataviewWorkspace: DataviewWorkspace) => {
        return (
          dataviewWorkspace.dataview &&
          dataviewWorkspace.dataview.config.type === Generators.Type.Track
        )
      }
    )
    return trackDataviewWorkspaces.map((dataviewWorkspace: DataviewWorkspace) => {
      const config: Generators.TrackGeneratorConfig = dataviewWorkspace.dataview?.config
      let vessel: VesselWithConfig = {
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
