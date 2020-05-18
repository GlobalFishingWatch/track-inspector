import React, { Fragment, useRef, useMemo } from 'react'
import ReactMapGL from 'react-map-gl'
import { useSelector } from 'react-redux'
import LayerComposer, { sort } from '@globalfishingwatch/layer-composer'
import useLayerComposer from '@globalfishingwatch/map-components/components/layer-composer-hook'
import Loader from 'features/loaders/Loader'
import { selectLoader } from 'features/loaders/loaders.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectGeneratorConfigWithData } from './map.selectors'
import { useViewport, useViewportConnect, useMapClick, useMapMove, useMapBounds } from './map.hooks'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapInfo from './MapInfo'
import MapControls from './MapControls'
import './Map.css'

const layerComposer = new LayerComposer()
const styleTransformations = [sort]

const Map = () => {
  const { zoom, latitude, longitude, dispatchViewport } = useViewportConnect()
  const { start, end } = useTimerangeConnect()
  const loading = useSelector(selectLoader('map'))
  const generatorConfigs = useSelector(selectGeneratorConfigWithData)

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
    dispatchViewport,
    zoom,
    latitude,
    longitude
  )

  const mapRef = useRef<any>(null)
  const onMapClick = useMapClick()
  const { onMapMove, hoverCenter } = useMapMove()

  const mapBounds = useMapBounds(mapRef)

  return (
    <Fragment>
      {loading && <Loader />}
      <ReactMapGL
        ref={mapRef}
        width="100%"
        height="100%"
        {...viewport}
        onViewportChange={onViewportChange as any}
        mapStyle={style}
        mapOptions={{
          customAttribution: '© Copyright Global Fishing Watch 2020',
        }}
        onClick={onMapClick}
        onMouseMove={onMapMove}
      >
        <MapInfo center={hoverCenter} />
      </ReactMapGL>
      <MapControls bounds={mapBounds} />
    </Fragment>
  )
}

export default Map
