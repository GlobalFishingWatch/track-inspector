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
