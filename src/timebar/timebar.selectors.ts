import { createSelector } from '@reduxjs/toolkit'
import { Loader } from '../types'
import { selectLoaders } from '../loaders/loaders.slice'

export const selectTimebarLoading = createSelector(
  [selectLoaders],
  (loaders: Loader[]): boolean => {
    return loaders.filter((l) => l.areas.includes('timebar')).length > 0
  }
)
