import { createReducer } from 'typesafe-actions'
import { setHighlightedTime, disableHighlightedTime } from './app.actions'

interface AppReducer {
  highlightedTime?: {
    start: string
    end: string
  }
}
const initialState: AppReducer = {}

export default createReducer(initialState)
  .handleAction(setHighlightedTime, (state: any, action: any) => {
    return {
      ...state,
      highlightedTime: {
        start: action.payload.start,
        end: action.payload.end,
      },
    }
  })
  .handleAction(disableHighlightedTime, (state: any, action: any) => {
    return { ...state, highlightedTime: null }
  })
