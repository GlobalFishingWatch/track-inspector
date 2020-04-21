import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Loader } from '../types'

export const getLoaders = (state: RootState) => state.loaders

export const getTimebarLoading = createSelector([getLoaders], (loaders: Loader[]): boolean => {
  return loaders.filter((l) => l.areas.includes('timebar')).length > 0
})
