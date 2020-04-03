import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import Map from './Map'
import { Type, GeneratorConfig } from '@globalfishingwatch/layer-composer'
import {
  getMapZoomQuery,
  getMapLatitudeQuery,
  getMapLongitudeQuery,
  getStartQuery,
  getEndQuery,
} from './model/route.selectors'
import { updateQueryParams } from './model/router.actions'
import { Loader } from './types/types'

const getGeneratorConfigs = (state: any) => state.map.generatorConfigs
const getTracks = (state: any) => state.vessels.tracks
const getVesselEvents = (state: any) => state.vessels.events
const getLoaders = (state: any) => state.loaders.loaders

const getGeneratorConfigWithData = createSelector(
  [getGeneratorConfigs, getTracks, getVesselEvents],
  (generatorConfigs, tracks, events) => {
    const generatorConfigsWithData = generatorConfigs.map((generatorConfig: GeneratorConfig) => {
      if (generatorConfig.type === Type.Track) {
        const data = tracks[generatorConfig.id]
        return {
          ...generatorConfig,
          data,
        }
      } else if (generatorConfig.type === Type.VesselEvents) {
        const data = events[generatorConfig.id]
        return {
          ...generatorConfig,
          data,
        }
      }
      return generatorConfig
    })
    return generatorConfigsWithData
  }
)

const getLoading = createSelector([getLoaders], (loaders): boolean => {
  return loaders.filter((l: Loader) => l.areas.includes('map')).length > 0
})

const mapStateToProps = (state: any) => ({
  zoom: getMapZoomQuery(state),
  latitude: getMapLatitudeQuery(state),
  longitude: getMapLongitudeQuery(state),
  start: getStartQuery(state),
  end: getEndQuery(state),
  generatorConfigs: getGeneratorConfigWithData(state),
  loading: getLoading(state),
})

const mapDispatchToProps = (dispatch: any) => ({
  setMapViewport: (zoom: number, latitude: number, longitude: number) => {
    dispatch(updateQueryParams({ zoom, latitude, longitude }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
