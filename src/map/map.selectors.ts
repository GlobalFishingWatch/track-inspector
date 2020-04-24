import { createSelector } from '@reduxjs/toolkit'
import { Type, GeneratorConfig } from '@globalfishingwatch/layer-composer'
import { selectTracks, selectEvents } from '../vessels/vessels.slice'
import { selectHighlightedTime } from '../timebar/timebar.slice'
import { selectDataviewsQuery } from '../routes/routes.selectors'
import { RulersGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/types/layer-composer/generators/types'

// TODO: deprecate, use GET params
export const selectGeneratorConfigs = (state: any) => state.map.generatorConfigs

export const selectGeneratorConfigWithData = createSelector(
  [selectGeneratorConfigs, selectTracks, selectEvents, selectHighlightedTime, selectDataviewsQuery],
  (generatorConfigs, tracks, events, highlightedTime, dvq) => {
    // console.log(dvq, generatorConfigs)
    const generatorConfigsWithData = generatorConfigs.map((generatorConfig: GeneratorConfig) => {
      if (generatorConfig.type === Type.Track && generatorConfig.datasetParamsId) {
        const data = tracks[generatorConfig.datasetParamsId]
        return {
          ...generatorConfig,
          data,
          highlightedTime,
        }
      } else if (generatorConfig.type === Type.VesselEvents && generatorConfig.datasetParamsId) {
        const data = events[generatorConfig.datasetParamsId]
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
      data: [
        {
          start: {
            latitude: 0,
            longitude: 0,
          },
          end: {
            latitude: 30,
            longitude: 30,
          },
        },
        {
          start: {
            latitude: 30,
            longitude: 0,
          },
          end: {
            latitude: 0,
            longitude: 30,
          },
          isNew: true,
        },
      ],
    }
    generatorConfigsWithData.push(rulersConfig)
    return generatorConfigsWithData
  }
)

// TODO Track-inspector specific, generalize
export const selectGeneratorConfigCurrentEventId = createSelector(
  [selectGeneratorConfigs],
  (generatorConfigs) => {
    const vesselEventsConfig = generatorConfigs.find(
      (generatorConfig: GeneratorConfig) => generatorConfig.type === Type.VesselEvents
    )
    if (vesselEventsConfig) {
      return vesselEventsConfig.currentEventId
    }
    return null
  }
)

export const selectGeneratorConfigByType = (type: Type, onlyVisible = false) =>
  createSelector([selectGeneratorConfigs], (generatorConfigs) => {
    return generatorConfigs.filter((config: GeneratorConfig) => {
      return config.type === type && (!onlyVisible || config.visible)
    })
  })
