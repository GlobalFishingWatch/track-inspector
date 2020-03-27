import { createAction } from 'typesafe-actions'
import { Loader } from '../types/types'

export const startLoading = createAction('START_LOADING')<Loader>()

export const completeLoading = createAction('COMPLETE_LOADING')<{
  id: string
}>()
