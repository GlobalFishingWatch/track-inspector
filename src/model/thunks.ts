import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import { getDataviews } from './route.selectors'

export const dataviewsThunk = async (dispatch: Dispatch, getState: StateGetter<any>) => {
  const state = getState()
  const dataviews = getDataviews(state)
  console.log('dataviewsThunk')
  if (dataviews) {
    console.log(dataviews)
    // if (dataviews.length)
  }
}