import { createSelector } from '@reduxjs/toolkit'
import { Type, GeneratorConfig } from '@globalfishingwatch/layer-composer'
import { Loader } from '../types'
import { selectLoaders } from '../loaders/loaders.slice'
import { selectTracks, selectEvents } from '../vessels/vessels.slice'
import { selectHighlightedTime } from '../timebar/timebar.slice'
import { selectDataviewsQuery } from '../routes/routes.selectors'

export const selectMapLoading = createSelector([selectLoaders], (loaders: Loader[]): boolean => {
  return loaders.filter((l) => l.areas.includes('map')).length > 0
})

// TODO: deprecate, use GET params
export const selectGeneratorConfigs = (state: any) => state.map.generatorConfigs

export const selectGeneratorConfigWithData = createSelector(
  [selectGeneratorConfigs, selectTracks, selectEvents, selectHighlightedTime, selectDataviewsQuery],
  (generatorConfigs, tracks, events, highlightedTime, dvq) => {
    console.log(dvq, generatorConfigs)
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
    return generatorConfigsWithData
  }
)
