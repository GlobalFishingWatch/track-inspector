// TODO: remove - should use dataviews in get params
import { createReducer } from 'typesafe-actions'
import { updateMapLayers } from './map.actions'
import { Dataview } from '@globalfishingwatch/api-client'

interface MapReducer {
  generatorConfigs: Dataview[]
}
const initialState: MapReducer = {
  generatorConfigs: [],
}

export default createReducer(initialState).handleAction(
  updateMapLayers,
  (state: any, action: any) => {
    return { ...state, generatorConfigs: action.payload }
  }
)
