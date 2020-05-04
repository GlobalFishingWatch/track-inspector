import { createSelector } from '@reduxjs/toolkit'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'
import { Type, GeneratorConfig } from '@globalfishingwatch/layer-composer'
import { selectDataviews } from './dataviews.slice'

export const selectDataviewByGeneratorConfigType = (type: Type) =>
  createSelector([selectDataviews], (dataviews) => {
    return dataviews.filter((dataviewWorkspace: DataviewWorkspace) => {
      if (!dataviewWorkspace.dataview || !dataviewWorkspace.dataview.config) return false
      return (dataviewWorkspace.dataview.config as GeneratorConfig).type === type
    })
  })

// TODO Track-inspector specific, generalize
export const selectGeneratorConfigCurrentEventId = createSelector(
  [selectDataviews],
  (dataviewConfigs) => {
    const vesselEventsConfig = dataviewConfigs.find(
      (dataviewConfig: DataviewWorkspace) =>
        dataviewConfig.dataview && dataviewConfig.dataview.config.type === Type.VesselEvents
    )
    if (vesselEventsConfig) {
      return vesselEventsConfig.dataview?.config.currentEventId
    }
    return null
  }
)
