import { createAction } from 'typesafe-actions'

// TODO type should be GeneratorConfig
export const updateMapLayers = createAction('UPDATE_MAP_LAYERS')<[any]>()