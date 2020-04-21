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
  selectStartQuery,
  selectEndQuery,
} from '../routes/routes.selectors'
import { selectMapLoading, selectGeneratorConfigWithData } from './map.selectors'
import useViewport, { Viewport } from './useViewport'
import Loader from '../loaders/Loader'

const layerComposer = new LayerComposer()
const styleTransformations = [sort]

function Map() {
  const zoom: number = useSelector(selectMapZoomQuery)
  const latitude: number = useSelector(selectMapLatitudeQuery)
  const longitude: number = useSelector(selectMapLongitudeQuery)
  const start = useSelector(selectStartQuery)
  const end = useSelector(selectEndQuery)
  const loading: boolean = useSelector(selectMapLoading)
  const generatorConfigs = useSelector(selectGeneratorConfigWithData)

  const dispatch = useDispatch()
  const globalGeneratorConfig = useMemo(
    () => ({
      start,
      end,
      zoom,
      styleTransformations,
    }),
    [start, end, zoom]
  )
  const [style] = useLayerComposer(layerComposer, generatorConfigs, globalGeneratorConfig)

  const [viewport, onViewportChange] = useViewport(
    // TODO this being an anonymous function, will a Map render be triggered with unrelated store changes???
    (viewport: Viewport) => {
      dispatch(updateQueryParams(viewport))
    },
    zoom,
    latitude,
    longitude
  )

  return (
    <div className="map">
      {loading && <Loader />}
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
