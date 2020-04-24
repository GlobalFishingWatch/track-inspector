import { createSelector } from '@reduxjs/toolkit'
import { Loader, LoaderArea } from '../types'
import { RootState } from '../store'

export const selectLoaders = (state: RootState) => state.loaders

export const selectLoader = (loader: LoaderArea) =>
  createSelector([selectLoaders], (loaders: Loader[]): boolean => {
    return loaders.filter((l) => l.areas.includes(loader)).length > 0
  })
