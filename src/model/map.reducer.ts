import { createReducer } from 'typesafe-actions'
import { updateMapLayers } from './map.actions'
import { Dataview } from '../types/dataviews-client'

interface MapReducer {
  generatorConfigs: Dataview[]
}
const initialState: MapReducer = {
  generatorConfigs: []
}

export default createReducer(initialState)
  .handleAction(updateMapLayers, (state: any, action:any) => {
    return { ...state, generatorConfigs: action.payload }
  })