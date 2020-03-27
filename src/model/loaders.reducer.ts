import { createReducer } from 'typesafe-actions'
import { startLoading, completeLoading } from './loaders.actions'
import { Loader } from '../types/types'

interface LoadersReducer {
  loaders: Loader[]
}
const initialState: LoadersReducer = {
  loaders: [],
}

export default createReducer(initialState)
  .handleAction(startLoading, (state: any, action: any) => {
    const loaders = [...state.loaders]
    if (!loaders.filter((l) => l.id === action.payload.id).length) {
      loaders.push(action.payload)
    }
    return { ...state, loaders }
  })
  .handleAction(completeLoading, (state: any, action: any) => {
    const loaders = [...state.loaders]
    const indexToRemove = loaders.findIndex((l) => l.id === action.payload.id)
    if (indexToRemove > -1) {
      loaders.splice(indexToRemove, 1)
    }
    return { ...state, loaders }
  })
