import { createAction } from 'typesafe-actions'

export const setHighlightedTime = createAction('SET_HIGHLIGHTED_TIME')<{
  start: string
  end: string
}>()
export const disableHighlightedTime = createAction('DISABLE_HIGHLIGHTED_TIME')()
