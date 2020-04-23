import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit'
import { Loader, LoaderArea } from '../types'
import { RootState } from '../store'

const initialState: Loader[] = []

const slice = createSlice({
  name: 'loaders',
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<Loader>) => {
      if (!state.filter((l) => l.id === action.payload.id).length) {
        state.push(action.payload)
      }
    },
    completeLoading: (state, action: PayloadAction<{ id: string }>) => {
      const indexToRemove = state.findIndex((l) => l.id === action.payload.id)
      if (indexToRemove > -1) {
        state.splice(indexToRemove, 1)
      }
    },
  },
})

export const { startLoading, completeLoading } = slice.actions
export default slice.reducer

export const selectLoaders = (state: RootState) => state.loaders

export const selectLoader = (loader: LoaderArea) =>
  createSelector([selectLoaders], (loaders: Loader[]): boolean => {
    return loaders.filter((l) => l.areas.includes(loader)).length > 0
  })
