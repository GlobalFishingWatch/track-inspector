import React, { useMemo } from 'react'
import ReactMapGL from 'react-map-gl'
import { useSelector, useDispatch } from 'react-redux'
import LayerComposer, { sort } from '@globalfishingwatch/layer-composer'
import useLayerComposer from '@globalfishingwatch/map-components/components/layer-composer-hook'
import { updateQueryParams } from '../routes/routes.actions'
import {
  selectMapZoomQuery,
  selectMapLatitudeQuery,
  selectMapLongitudeQuery,
} from '../routes/routes.selectors'
import useViewport, { Viewport } from './useViewport'

const layerComposer = new LayerComposer()
const styleTransformations = [sort]

const generatorConfigs: any = [
  {
    type: 'BACKGROUND',
  },
  {
    type: 'BASEMAP',
    id: 'landmass',
  },
]

// const setMapViewport: (viewport: Viewport) => {
//   dispatch(updateQueryParams(viewport))
// }

function Map(props: any) {
  const {
    // start,
    // end,
    // generatorConfigs
    // setMapViewport,
    // loading,
  } = props

  const zoom: number = useSelector(selectMapZoomQuery)
  const latitude: number = useSelector(selectMapLatitudeQuery)
  const longitude: number = useSelector(selectMapLongitudeQuery)

  const dispatch = useDispatch()
  const globalGeneratorConfig = useMemo(
    () => ({
      // start,
      // end,
      // zoom,
      styleTransformations,
    }),
    // [start, end, zoom]
    []
  )
  const [style] = useLayerComposer(layerComposer, generatorConfigs, globalGeneratorConfig)

  const [viewport, onViewportChange] = useViewport(
    (viewport: Viewport) => {
      dispatch(updateQueryParams(viewport))
    },
    zoom,
    latitude,
    longitude
  )

  return (
    <div className="map">
      {/* {loading && <Loader />} */}
      <ReactMapGL
        width="100%"
        height="100%"
        {...viewport}
        onViewportChange={onViewportChange as any}
        mapStyle={style}
      />
    </div>
  )
}

export default Map
