import { Dispatch } from 'redux'
import { NOT_FOUND, RoutesMap, redirect, StateGetter } from 'redux-first-router'
import { dataviewsThunk } from './thunks'

export const HOME = 'HOME'

const preFetchThunks = [dataviewsThunk]

const thunk = async (dispatch: Dispatch<any>, getState: StateGetter<any>) => {
  preFetchThunks.forEach((thunk) => thunk(dispatch, getState))
}

const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
    thunk,
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }))
    },
  },
}

export default routesMap
