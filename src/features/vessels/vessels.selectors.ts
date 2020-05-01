import { createSelector } from '@reduxjs/toolkit'
import { Type, GeneratorConfig } from '@globalfishingwatch/layer-composer'
import { selectGeneratorConfigs } from 'features/map/map.selectors'
import { Vessel, selectVessels } from './vessels.slice'

export const selectVesselsWithConfig = createSelector(
  [selectGeneratorConfigs, selectVessels],
  (generatorConfigs, vessels) => {
    const trackGenerators = generatorConfigs.filter(
      (generatorConfig: GeneratorConfig) => generatorConfig.type === Type.Track
    )
    return trackGenerators.map((trackGenerator: GeneratorConfig) => {
      let vessel: Vessel = {
        name: trackGenerator.id,
        ...trackGenerator,
      }
      if (trackGenerator.datasetParamsId) {
        vessel.name = trackGenerator.datasetParamsId
        const vesselInfo = vessels[trackGenerator.datasetParamsId]
        if (vesselInfo) {
          vessel = { ...vessel, ...vesselInfo }
        }
      }
      return vessel
    })
  }
)
