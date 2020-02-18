import { connect } from 'react-redux'
import Map from './Map'
import { getMapZoomQuery, getMapLatitudeQuery, getMapLongitudeQuery } from './model/route.selectors'
import { Dispatch } from 'redux'

const mapStateToProps = (state: any) => ({
  zoom: getMapZoomQuery(state),
  latitude: getMapLatitudeQuery(state),
  longitude: getMapLongitudeQuery(state),
})

const mapDispatchToProps = (dispatch: any) => ({
  setMapViewport: (zoom: number, latitude: number, longitude: number) => {
    dispatch({
      type: 'HOME',
      query: {
        zoom, latitude, longitude
      }
    })
  }
    // dispatch(updateQueryParams({ ...coordinates, zoom })),
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
