import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { DataviewWorkspace } from '@globalfishingwatch/dataviews-client'
import { selectTracks, selectEvents } from 'features/vessels/vessels.slice'
import { selectHighlightedTime, selectHighlightedEvent } from 'features/timebar/timebar.slice'
import { selectRulers } from 'features/rulers/rulers.selectors'
import { selectDataviews } from 'features/dataviews/dataviews.slice'

export const selectGeneratorConfigWithData = createSelector(
  [
    selectDataviews,
    selectTracks,
    selectEvents,
    selectHighlightedTime,
    selectRulers,
    selectHighlightedEvent,
  ],
  (dataviews, tracks, events, highlightedTime, rulers, highlightedEvent) => {
    const generatorConfigsWithData = dataviews.map((dataviewWorkspace: DataviewWorkspace) => {
      if (!dataviewWorkspace.dataview || !dataviewWorkspace.dataview.config) return null
      const generatorConfig: Generators.GeneratorConfig = dataviewWorkspace.dataview.config
      const datasetParamsId = dataviewWorkspace.datasetParams.id
      if (generatorConfig.type === Generators.Type.Track && datasetParamsId) {
        const data = tracks[datasetParamsId]
        return {
          ...generatorConfig,
          data,
          highlightedTime,
        }
      } else if (generatorConfig.type === Generators.Type.VesselEvents && datasetParamsId) {
        const data = events[datasetParamsId]
        const vesselEventsConfig: Generators.VesselEventsGeneratorConfig = {
          ...generatorConfig,
          data,
        }
        if (highlightedEvent) {
          vesselEventsConfig.currentEventId = highlightedEvent.id
        } else if (dataviewWorkspace.overrides.currentEventId) {
          vesselEventsConfig.currentEventId = dataviewWorkspace.overrides.currentEventId
        }
        return vesselEventsConfig
      }
      return generatorConfig
    })
    const rulersConfig: Generators.RulersGeneratorConfig = {
      type: Generators.Type.Rulers,
      id: 'rulers',
      data: rulers,
    }
    generatorConfigsWithData.push(rulersConfig)
    return generatorConfigsWithData
  }
)
