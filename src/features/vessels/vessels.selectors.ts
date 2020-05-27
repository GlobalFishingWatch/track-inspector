import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectDataviews } from 'features/dataviews/dataviews.slice'
import { Vessel, selectVessels, selectTracks } from './vessels.slice'
import { DataviewWorkspace } from '@globalfishingwatch/dataviews-client'

export type VesselWithConfig = Partial<
  Vessel & Generators.TrackGeneratorConfig & { trackLoading: boolean }
>

export const selectVesselsWithConfig = createSelector(
  [selectDataviews, selectVessels, selectTracks],
  (dataviewWorkspaces, vessels, tracks) => {
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
        trackLoading: true,
        ...config,
      }
      if (config.datasetParamsId) {
        const vesselInfo = vessels[config.datasetParamsId]
        if (vesselInfo) {
          vessel = { ...vessel, ...vesselInfo }
        }
        vessel.trackLoading = !tracks[config.datasetParamsId]
      }
      return vessel as VesselWithConfig
    })
  }
)
