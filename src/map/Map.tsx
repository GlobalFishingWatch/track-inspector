import React, { useMemo } from 'react'
import ReactMapGL from 'react-map-gl'
import { useSelector, useDispatch } from 'react-redux'
import LayerComposer, { sort } from '@globalfishingwatch/layer-composer'
import useLayerComposer from '@globalfishingwatch/map-components/components/layer-composer-hook'
import { updateQueryParams } from '../routes/routes.actions'
import { selectViewport, selectTimerange } from '../routes/routes.selectors'
import { selectGeneratorConfigWithData } from './map.selectors'
import useViewport, { Viewport } from './useViewport'
import Loader from '../loaders/Loader'
import { selectLoader } from '../loaders/loaders.slice'
import 'mapbox-gl/dist/mapbox-gl.css'
import './Map.css'

const layerComposer = new LayerComposer()
const styleTransformations = [sort]

function Map() {
  const { zoom, latitude, longitude } = useSelector(selectViewport)
  const { start, end } = useSelector(selectTimerange)
  const loading = useSelector(selectLoader('map'))
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
        mapOptions={{
          customAttribution: '© Copyright Global Fishing Watch 2019',
        }}
      />
    </div>
  )
}

export default Map
