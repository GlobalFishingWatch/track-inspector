import { createSelector } from '@reduxjs/toolkit'
import { Type, GeneratorConfig } from '@globalfishingwatch/layer-composer'
import { RulersGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/types/layer-composer/generators/types'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'
import { selectTracks, selectEvents } from 'features/vessels/vessels.slice'
import { selectHighlightedTime } from 'features/timebar/timebar.slice'
import { selectRulers } from 'features/rulers/rulers.selectors'
import { selectDataviews } from 'features/dataviews/dataviews.slice'

export const selectGeneratorConfigWithData = createSelector(
  [selectDataviews, selectTracks, selectEvents, selectHighlightedTime, selectRulers],
  (dataviews, tracks, events, highlightedTime, rulers) => {
    const generatorConfigsWithData = dataviews
      // TODO currently we filter out dataviews that don't have a config.type and infer this DV is not meant for LayerComposer
      //      We might need to have a more explicit mechanism later
      .filter((dataviewWorkspace: DataviewWorkspace) => {
        return dataviewWorkspace.dataview?.config && dataviewWorkspace.dataview.config.type
      })
      .map((dataviewWorkspace: DataviewWorkspace) => {
        if (!dataviewWorkspace.dataview || !dataviewWorkspace.dataview.config) return null
        const generatorConfig: GeneratorConfig = dataviewWorkspace.dataview.config
        const datasetParamsId = dataviewWorkspace.datasetParams.id
        if (generatorConfig.type === Type.Track && datasetParamsId) {
          const data = tracks[datasetParamsId]
          return {
            ...generatorConfig,
            data,
            highlightedTime,
          }
        } else if (generatorConfig.type === Type.VesselEvents && datasetParamsId) {
          const data = events[datasetParamsId]
          return {
            ...generatorConfig,
            data,
          }
        }
        return generatorConfig
      })
    const rulersConfig: RulersGeneratorConfig = {
      type: Type.Rulers,
      id: 'rulers',
      data: rulers,
    }
    generatorConfigsWithData.push(rulersConfig)
    return generatorConfigsWithData
  }
)
