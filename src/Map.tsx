import React, { useMemo } from 'react'
import ReactMapGL from 'react-map-gl'
import LayerComposer, { sort } from '@globalfishingwatch/layer-composer'
import useLayerComposer from '@globalfishingwatch/map-components/components/layer-composer-hook'
import useViewport from './useViewport'
import Loader from './Loader'

const layerComposer = new LayerComposer()
const styleTransformations = [sort]

function Map(props: any) {
  const { zoom, latitude, longitude, start, end, generatorConfigs, setMapViewport, loading } = props

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

  const [viewport, onViewportChange] = useViewport(setMapViewport, zoom, latitude, longitude)

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
