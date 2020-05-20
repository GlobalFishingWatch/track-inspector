import { createSelector } from '@reduxjs/toolkit'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectDataviews } from './dataviews.slice'

export const selectDataviewByGeneratorConfigType = (type: Generators.Type) =>
  createSelector([selectDataviews], (dataviews) => {
    return dataviews.filter((dataviewWorkspace: DataviewWorkspace) => {
      if (!dataviewWorkspace.dataview || !dataviewWorkspace.dataview.config) return false
      return (dataviewWorkspace.dataview.config as Generators.GeneratorConfig).type === type
    })
  })

export const selectGeneratorConfigCurrentEventId = createSelector(
  [selectDataviews],
  (dataviewConfigs) => {
    const vesselEventsConfig = dataviewConfigs.find(
      (dataviewConfig: DataviewWorkspace) =>
        dataviewConfig.dataview &&
        dataviewConfig.dataview.config.type === Generators.Type.VesselEvents &&
        dataviewConfig.overrides.currentEventId
    )
    if (vesselEventsConfig) {
      return vesselEventsConfig.overrides.currentEventId
    }
    return null
  }
)
