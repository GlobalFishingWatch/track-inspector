import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import Map from './Map'
import { TYPES, GeneratorConfig } from '@globalfishingwatch/layer-composer'
import {
  getMapZoomQuery,
  getMapLatitudeQuery,
  getMapLongitudeQuery,
  getStartQuery,
  getEndQuery,
} from './model/route.selectors'
import { updateQueryParams } from './model/router.actions'

const getGeneratorConfigs = (state: any) => state.map.generatorConfigs
const getTracks = (state: any) => state.vessels.tracks
const getVesselEvents = (state: any) => state.vessels.events

const getGeneratorConfigWithData = createSelector(
  [getGeneratorConfigs, getTracks, getVesselEvents],
  (generatorConfigs, tracks, events) => {
    const generatorConfigsWithData = generatorConfigs.map((generatorConfig: GeneratorConfig) => {
      if (generatorConfig.type === TYPES.TRACK) {
        const data = tracks[generatorConfig.id]
        return {
          ...generatorConfig,
          data,
        }
      } else if (generatorConfig.type === TYPES.VESSEL_EVENTS) {
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

const mapStateToProps = (state: any) => ({
  zoom: getMapZoomQuery(state),
  latitude: getMapLatitudeQuery(state),
  longitude: getMapLongitudeQuery(state),
  start: getStartQuery(state),
  end: getEndQuery(state),
  generatorConfigs: getGeneratorConfigWithData(state),
})

const mapDispatchToProps = (dispatch: any) => ({
  setMapViewport: (zoom: number, latitude: number, longitude: number) => {
    dispatch(updateQueryParams({ zoom, latitude, longitude }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
