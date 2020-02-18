import { connect } from 'react-redux'
import Map from './Map'
import { getMapZoomQuery, getMapLatitudeQuery, getMapLongitudeQuery } from './model/route.selectors'
import { updateQueryParams } from './model/router.actions'

const getGeneratorConfigs = (state: any) => state.map.generatorConfigs

const mapStateToProps = (state: any) => ({
  zoom: getMapZoomQuery(state),
  latitude: getMapLatitudeQuery(state),
  longitude: getMapLongitudeQuery(state),
  generatorConfigs: getGeneratorConfigs(state)
})

const mapDispatchToProps = (dispatch: any) => ({
  setMapViewport: (zoom: number, latitude: number, longitude: number) => {
    dispatch(updateQueryParams({ zoom, latitude, longitude }))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
